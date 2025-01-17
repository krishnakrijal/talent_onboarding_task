﻿namespace talent_onboarding.Server.Dtos
{
    public class SaleDto
    {
        public int Id { get; set; }

        public int? CustomerId { get; set; }

        public int? ProductId { get; set; }

        public int? StoreId { get; set; }

        public DateTime? DateSold { get; set; }

        public string? CustomerName { get; set; }

        public string? ProductName { get; set; }

        public string? StoreName { get; set; }
    }
}
