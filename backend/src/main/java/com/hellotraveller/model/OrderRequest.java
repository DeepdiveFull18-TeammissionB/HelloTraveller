package com.hellotraveller.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Totals totals;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Totals {
        private double total;
    }
}
