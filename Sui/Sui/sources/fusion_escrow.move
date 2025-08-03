// Copyright (c) 2024, Sui Foundation
// SPDX-License-Identifier: Apache-2.0

/// ===============================================================================================
/// This module implements a Hash Time Lock Contract (HTLC) on the Sui blockchain.
/// It is designed to facilitate cross-chain atomic swaps.
///
/// Core Logic:
/// 1.  **Creation**: A `maker` creates an HTLC, locking a specific `Coin<T>` and defining a
///     `hashlock` (a SHA-256 hash of a secret), a `timelock` (an expiration timestamp), and a
///     `taker` address. The created `Htlc` object is shared.
/// 2.  **Withdrawal**: The `taker` can withdraw the locked `Coin<T>` by providing the correct
///     `secret` *before* the `timelock` expires. Providing the secret proves they have fulfilled
///     their side of the off-chain agreement.
/// 3.  **Cancellation**: If the `taker` fails to withdraw the funds before the `timelock` expires,
///     the original `maker` can cancel the HTLC and reclaim their locked `Coin<T>`.
///
/// This implementation is generic and can work with any asset that has the `key` and `store`
/// abilities (e.g., any `Coin<T>`).
/// ===============================================================================================
module fusion_escrow::htlc {
    use sui::balance::{ Balance};
    use sui::coin::{Coin};
    use sui::clock::{Clock};
    use std::hash;
    // use sui::transfer;
    // use sui::tx_context::{TxContext};
    // use sui::object::{Self, UID, ID};
    use sui::event;

    // === Errors ===

    /// The provided secret does not match the hashlock.
    const EInvalidSecret: u64 = 1;
    /// The timelock has already expired, withdrawal is not possible.
    const ETimelockExpired: u64 = 2;
    /// The timelock has not yet expired, cancellation is not possible.
    const ETimelockNotExpired: u64 = 3;
    /// The caller is not the designated taker of this HTLC.
    const ENotTaker: u64 = 4;
    /// The caller is not the designated maker of this HTLC.
    const ENotMaker: u64 = 5;

    // === Structs ===

    /// Represents a single Hash Time Lock Contract.
    /// This object is shared on-chain and holds the locked assets.
    /// The type parameter `T` allows this HTLC to work with any generic `Coin`.
    public struct Htlc<phantom T: store> has key, store { 
        id: UID,
        /// The SHA-256 hash of the secret. The taker must provide the pre-image to withdraw.
        hashlock: vector<u8>,
        /// The Unix timestamp (in milliseconds) after which the maker can cancel the HTLC.
        timelock: u64,
        /// The address of the user who created the HTLC and locked the funds.
        maker: address,
        /// The address of the user who is entitled to withdraw the funds by providing the secret.
        taker: address,
        /// The balance of the coin that is locked in this contract.
        asset: Balance<T>, 
    }

    /// An event emitted when a new HTLC is successfully created.
    public struct HtlcCreated has copy, drop {
        htlc_id: ID,
        maker: address,
        taker: address,
        amount: u64,
        hashlock: vector<u8>,
        timelock: u64,
    }

    /// An event emitted when the funds from an HTLC are successfully withdrawn by the taker.
    public struct HtlcWithdrawn has copy, drop {
        htlc_id: ID,
        taker: address,
        secret: vector<u8>,
    }

    /// An event emitted when an HTLC is successfully cancelled by the maker after expiration.
    public struct HtlcCanceled has copy, drop {
        htlc_id: ID,
        maker: address,
    }

    // === Public Functions ===

    /// Creates a new HTLC, locks the provided `asset`, and shares the `Htlc` object.
    public entry fun create<T: store>( 
        hashlock: vector<u8>,
        timelock: u64,
        taker: address,
        asset: Coin<T>,
        ctx: &mut TxContext
    ) {
        let asset_value = asset.value();
        // Create the HTLC object.
        let htlc = Htlc {
            id: object::new(ctx),
            hashlock,
            timelock,
            maker: ctx.sender(),
            taker,
            asset: asset.into_balance(),
        };

        // Emit an event to notify off-chain indexers about the new HTLC.
        event::emit(HtlcCreated {
            htlc_id: object::id(&htlc),
            maker: htlc.maker,
            taker: htlc.taker,
            amount: asset_value, // Use the stored value
            hashlock: htlc.hashlock,
            timelock: htlc.timelock,
        });

        // Share the object so it's accessible to both the maker and taker.
        transfer::share_object(htlc);
    }

    /// Allows the `taker` to withdraw the locked asset by providing the correct `secret`.
    public entry fun withdraw<T: store>( 
        htlc: Htlc<T>, 
        secret: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(sender == htlc.taker, ENotTaker);
        assert!(clock.timestamp_ms() < htlc.timelock, ETimelockExpired);

        let hashed_secret = hash::sha2_256(secret); 
        assert!(hashed_secret == htlc.hashlock, EInvalidSecret);

        event::emit(HtlcWithdrawn {
            htlc_id: object::id(&htlc), // Note: Must borrow before move
            taker: sender,
            secret,
        });

        let Htlc { id, asset, .. } = htlc;
        let coin = asset.into_coin(ctx); 
        transfer::public_transfer(coin, sender);
        id.delete(); 
    }

    /// Allows the `maker` to cancel the HTLC and reclaim their asset.
    public entry fun cancel<T: store>( 
        htlc: Htlc<T>, 
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(sender == htlc.maker, ENotMaker);
        assert!(clock.timestamp_ms() >= htlc.timelock, ETimelockNotExpired);

        event::emit(HtlcCanceled {
            htlc_id: object::id(&htlc), // Note: Must borrow before move
            maker: sender,
        });

        let Htlc { id, asset, .. } = htlc; // 
        let coin = asset.into_coin(ctx); // 
        transfer::public_transfer(coin, sender);
        id.delete(); 
    }

    // === View Functions ===

    /// Returns the details of an HTLC. Can be called by anyone.
    public fun get_details<T: store>(htlc: &Htlc<T>): (vector<u8>, u64, address, address, u64) {
        (
            htlc.hashlock,
            htlc.timelock,
            htlc.maker,
            htlc.taker,
            htlc.asset.value() // This works on Balance<T> as well
        )
    }
}