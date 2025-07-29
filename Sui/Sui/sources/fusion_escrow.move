module fusion_escrow::fusion_escrow {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::address::Address;
    use sui::object::UID;

    /// Escrow state: 0 = Active, 1 = Withdrawn, 2 = Canceled
    const STATE_ACTIVE: u8 = 0;
    const STATE_WITHDRAWN: u8 = 1;
    const STATE_CANCELED: u8 = 2;

    /// The main Escrow object for cross-chain swaps
    struct Escrow<TokenType> has key, store {
        id: UID,
        secret_hash: vector<u8>,
        depositor: address,
        recipient: address,
        coin: Coin<TokenType>,
        sui_deposit: Coin<SUI>,
        deadline: u64, // Unix timestamp in ms
        state: u8, // 0 = active, 1 = withdrawn, 2 = canceled
    }

    // Entry functions and events will be added in the next steps.
} 