#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod cruddappsolana {
    use super::*;

  pub fn close(_ctx: Context<CloseCruddappsolana>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.cruddappsolana.count = ctx.accounts.cruddappsolana.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.cruddappsolana.count = ctx.accounts.cruddappsolana.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeCruddappsolana>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.cruddappsolana.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCruddappsolana<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Cruddappsolana::INIT_SPACE,
  payer = payer
  )]
  pub cruddappsolana: Account<'info, Cruddappsolana>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCruddappsolana<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub cruddappsolana: Account<'info, Cruddappsolana>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub cruddappsolana: Account<'info, Cruddappsolana>,
}

#[account]
#[derive(InitSpace)]
pub struct Cruddappsolana {
  count: u8,
}
