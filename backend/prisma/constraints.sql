ALTER TABLE "ProductVariant" ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
ALTER TABLE "Event" ADD CONSTRAINT seats_cap CHECK ("seatsSold" <= "totalSeats");
ALTER TABLE "LedgerEntry" ADD CONSTRAINT amount_positive CHECK (amount > 0);
