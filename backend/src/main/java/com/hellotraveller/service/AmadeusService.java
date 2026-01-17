package com.hellotraveller.service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;
import org.springframework.stereotype.Service;

@Service
public class AmadeusService {

    private final Amadeus amadeus;

    // 생성자 주입: AmadeusConfig에서 만든 Bean이 자동으로 들어옵니다.
    public AmadeusService(Amadeus amadeus) {
        this.amadeus = amadeus;
    }

    public FlightOfferSearch[] getFlightOffers(String origin, String destination, String date)
            throws ResponseException {
        return amadeus.shopping.flightOffersSearch.get(
                Params.with("originLocationCode", origin)
                        .and("destinationLocationCode", destination)
                        .and("departureDate", date)
                        .and("adults", 1));
    }
}