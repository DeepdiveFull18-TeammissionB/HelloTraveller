package com.hellotraveller.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    private String name;
    private String imagePath;
    private String description;
    private double price;
    private List<State> states; // 복구
}
