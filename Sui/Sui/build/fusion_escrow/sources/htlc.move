module fusion_escrow::htlc {
    // FIXED: Corrected and cleaned up use statements
    use sui::balance::Balance;
    use sui::coin::Coin;
    use sui::clock::Clock;
    use std::hash; // <-- FIXED: Was `std::hash`
    use sui::event;
    use sui::object::{ID, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;

    const EInvalidSecret: u64 = 1;
    const ETimelockExpired: u64 = 2;
    const ETimelockNotExpired: u64 = 3;
    const ENotTaker: u64 = 4;
    const ENotMaker: u64 = 5;

    public struct Htlc<phantom T: store> has key, store { 
        id: UID,
        hashlock: vector<u8>,
        timelock: u64,
        maker: address,
        taker: address,
        asset: Balance<T>, 
    }

    public struct HtlcCreated has copy, drop {
        htlc_id: ID,
        maker: address,
        taker: address,
        amount: u64,
        hashlock: vector<u8>,
        timelock: u64,
    }

    public struct HtlcWithdrawn has copy, drop {
        htlc_id: ID,
        taker: address,
        secret: vector<u8>,
    }

    public struct HtlcCanceled has copy, drop {
        htlc_id: ID,
        maker: address,
    }

    public entry fun create<T: store>( 
        hashlock: vector<u8>,
        timelock: u64,
        taker: address,
        asset: Coin<T>,
        ctx: &mut TxContext
    ) {
        let asset_value = asset.value();
        let htlc = Htlc {
            id: object::new(ctx),
            hashlock,
            timelock,
            maker: ctx.sender(),
            taker,
            asset: asset.into_balance(),
        };

        event::emit(HtlcCreated {
            htlc_id: object::id(&htlc),
            maker: htlc.maker,
            taker: htlc.taker,
            amount: asset_value,
            hashlock: htlc.hashlock,
            timelock: htlc.timelock,
        });

        transfer::share_object(htlc);
    }

    public entry fun withdraw<T: store>( 
        htlc: Htlc<T>, 
        secret: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(sender == htlc.taker, ENotTaker);
        assert!(clock.timestamp_ms() < htlc.timelock, ETimelockExpired);

        // FIXED: Pass the secret by reference (&)
        let hashed_secret = hash::sha2_256(secret); 
        assert!(hashed_secret == htlc.hashlock, EInvalidSecret);

        event::emit(HtlcWithdrawn {
            htlc_id: object::id(&htlc),
            taker: sender,
            secret,
        });

        let Htlc { id, asset, .. } = htlc;
        let coin = asset.into_coin(ctx); 
        transfer::public_transfer(coin, sender);
        id.delete(); 
    }

    public entry fun cancel<T: store>( 
        htlc: Htlc<T>, 
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(sender == htlc.maker, ENotMaker);
        assert!(clock.timestamp_ms() >= htlc.timelock, ETimelockNotExpired);

        event::emit(HtlcCanceled {
            htlc_id: object::id(&htlc),
            maker: sender,
        });

        let Htlc { id, asset, .. } = htlc;
        let coin = asset.into_coin(ctx); 
        transfer::public_transfer(coin, sender);
        id.delete(); 
    }

    public fun get_details<T: store>(htlc: &Htlc<T>): (vector<u8>, u64, address, address, u64) {
        (
            htlc.hashlock,
            htlc.timelock,
            htlc.maker,
            htlc.taker,
            htlc.asset.value()
        )
    }
}