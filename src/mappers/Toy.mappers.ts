import { ToyBuilder } from "../model/Builder/toy.builder";
import { Toy } from "../model/Toy.models";
import { IMapper } from "./IMapper";

export class XMLToyMapper implements IMapper<any, Toy> {
    map(data: any): Toy {
        
        const ageGroupText = data.AgeGroup;
        const ageGroup = Number(ageGroupText);

        return ToyBuilder.newBuilder()
            .setOrderID(Number(data.OrderID))
            .setType(data.Type)
            .setAgeGroup(ageGroup)
            .setBrand(data.Brand)
            .setMaterial(data.Material)
            .setBatteryRequired(Boolean(data.BatteryRequired))
            .setEducational(Boolean(data.Educational))
            .setPrice(Number(data.Price))
            .setQuantity(Number(data.Quantity))
            .build();
    }
}