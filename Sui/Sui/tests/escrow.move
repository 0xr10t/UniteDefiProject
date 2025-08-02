#[test_only]
module fusion_escrow::htlc_tests {
    use sui::test_scenario::{Self as ts};
    use sui::coin::{Self, Coin};
    // use sui::transfer;
    // use std::option;
    use sui::clock::{Self};
    // use sui::object::ID;

    // Import the module we want to test
    use fusion_escrow::htlc::{Self, Htlc};

    // === Test Coin Definition ===

    /// A mock coin for testing that has the required abilities.
    public struct MOCK_COIN has key, store{
        // FIXED: Objects with `key` ability MUST have `id: UID` as the first field.
        id: UID,
    }

    // === Test Constants ===

    const MAKER: address = @0x100;
    const TAKER: address = @0x200;
    const AMOUNT: u64 = 1_000_000_000;

    const PREIMAGE: vector<u8> = b"hello sui";
    const HASHLOCK: vector<u8> = x"3a60215b306be6331942479935515239e338c227843809a7272895f403e0591f";

    const ONE_HOUR_MS: u64 = 3_600_000;

    // === Test Cases ===

    #[test]
    fun test_withdraw_succeeds() {
        let mut ts = ts::begin(MAKER);
        let clock = clock::create_for_testing(ts::ctx(&mut ts));

        // Create the HTLC in one transaction
        ts::next_tx(&mut ts, MAKER);
        let coin = coin::mint_for_testing<MOCK_COIN>(AMOUNT, ts::ctx(&mut ts));
        let now = clock.timestamp_ms();
        htlc::create(HASHLOCK, now + ONE_HOUR_MS, TAKER, coin, ts::ctx(&mut ts));

        // In the next transaction, the TAKER withdraws
        ts::next_tx(&mut ts, TAKER);
        let htlc_obj = ts::take_shared<Htlc<MOCK_COIN>>(& ts);
        htlc::withdraw(htlc_obj, PREIMAGE, &clock, ts::ctx(&mut ts));

        // Check that the taker now has the coin
        let withdrawn_coin = ts::take_from_sender<Coin<MOCK_COIN>>(&ts);
        assert!(withdrawn_coin.value() == AMOUNT, 0);
        coin::burn_for_testing(withdrawn_coin);

        clock::destroy_for_testing(clock);
        ts::end(ts);
    }

    #[test]
    fun test_cancel_succeeds() {
        let mut ts = ts::begin(MAKER);
        let mut clock = clock::create_for_testing(ts::ctx(&mut ts));

        // Create the HTLC
        ts::next_tx(&mut ts, MAKER);
        let coin = coin::mint_for_testing<MOCK_COIN>(AMOUNT, ts::ctx(&mut ts));
        let now = clock.timestamp_ms();
        htlc::create(HASHLOCK, now + ONE_HOUR_MS, TAKER, coin, ts::ctx(&mut ts));

        // Advance the clock past the timelock
        clock::increment_for_testing(&mut clock, ONE_HOUR_MS + 1);

        // MAKER cancels the HTLC
        ts::next_tx(&mut ts, MAKER);
        let htlc_obj = ts::take_shared<Htlc<MOCK_COIN>>(& ts);
        htlc::cancel(htlc_obj, &clock, ts::ctx(&mut ts));

        // Check that the maker has their coin back
        let refunded_coin = ts::take_from_sender<Coin<MOCK_COIN>>(&ts);
        assert!(refunded_coin.value() == AMOUNT, 0);
        coin::burn_for_testing(refunded_coin);

        clock::destroy_for_testing(clock);
        ts::end(ts);
    }

    #[test]
    #[expected_failure(abort_code = htlc::ENotTaker)]
    fun test_withdraw_fails_not_taker() {
        let mut ts = ts::begin(MAKER);
        let clock = clock::create_for_testing(ts::ctx(&mut ts));

        // Create the HTLC
        ts::next_tx(&mut ts, MAKER);
        let coin = coin::mint_for_testing<MOCK_COIN>(AMOUNT, ts::ctx(&mut ts));
        let now = clock.timestamp_ms();
        htlc::create(HASHLOCK, now + ONE_HOUR_MS, TAKER, coin, ts::ctx(&mut ts));

        // The MAKER (not the taker) incorrectly tries to withdraw
        ts::next_tx(&mut ts, MAKER);
        let htlc_obj = ts::take_shared<Htlc<MOCK_COIN>>(& ts);
        htlc::withdraw(htlc_obj, PREIMAGE, &clock, ts::ctx(&mut ts));

        // The test will abort above, but cleanup is still good practice
        clock::destroy_for_testing(clock);
        ts::end(ts);
    }
}