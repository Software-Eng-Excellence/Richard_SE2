import { IdentifiableToyBuilder, ToyBuilder } from "../model/Builder/toy.builder";
import { IdentifiableToy, Toy } from "../model/Toy.models";
import { IMapper } from "./IMapper";

export class XMLToyMapper implements IMapper<XMLDocument, Toy> {
    
    private getTagValue(xml: XMLDocument, tag: string): string | null {
        const el = xml.getElementsByTagName(tag)[0];
        return el ? el.textContent : null;
    }

    map(data: XMLDocument): Toy {
        const orderID = this.getTagValue(data, "OrderID");
        const type = this.getTagValue(data, "Type");
        const ageGroupText = this.getTagValue(data, "AgeGroup");
        const brand = this.getTagValue(data, "Brand");
        const material = this.getTagValue(data, "Material");
        const batteryRequired = this.getTagValue(data, "BatteryRequired");
        const educational = this.getTagValue(data, "Educational");
        const price = this.getTagValue(data, "Price");
        const quantity = this.getTagValue(data, "Quantity");

        return ToyBuilder.newBuilder()
            
            .setType(type || "")
            .setAgeGroup(ageGroupText ? Number(ageGroupText) : 0)
            .setBrand(brand || "")
            .setMaterial(material || "")
            .setBatteryRequired(batteryRequired === "true")
            .setEducational(educational === "true")
            .setPrice(price ? Number(price) : 0)
            .setQuantity(quantity ? Number(quantity) : 0)
            .build();
    }

    reverse(data: Toy): XMLDocument {
        const xmlString = `
            <Toy>
               
                <Type>${data.getType()}</Type>
                <AgeGroup>${data.getAgeGroup()}</AgeGroup>
                <Brand>${data.getBrand()}</Brand>
                <Material>${data.getMaterial()}</Material>
                <BatteryRequired>${data.getBatteryRequired()}</BatteryRequired>
                <Educational>${data.getEducational()}</Educational>
                <Price>${data.getPrice()}</Price>
                <Quantity>${data.getQuantity()}</Quantity>
            </Toy>`;
                    
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, "application/xml");
    }
}
export interface PostgresToy {
    id: string;
    type: string;
    ageGroup: number;
    brand: string;
    material: string;
    batteryRequired: boolean;
    educational: boolean;
    price: number;
    quantity: number;
}

export class PostgresToyMapper implements IMapper<PostgresToy, Toy> {

    map(data: PostgresToy): IdentifiableToy {
        return IdentifiableToyBuilder.newBuilder()
        .setToy(
            ToyBuilder.newBuilder()
                .setType(data.type)
                .setAgeGroup(data.ageGroup)
                .setBrand(data.brand)
                .setMaterial(data.material)
                .setBatteryRequired(data.batteryRequired)
                .setEducational(data.educational)
                .setPrice(data.price)
                .setQuantity(data.quantity)
                .build()
        )
        .setId(data.id)
        .build();
    }

    reverse(data: IdentifiableToy): PostgresToy {
        return {
            id: data.getId(),
            type: data.getType(),
            ageGroup: data.getAgeGroup(),
            brand: data.getBrand(),
            material: data.getMaterial(),
            batteryRequired: data.getBatteryRequired(),
            educational: data.getEducational(),
            price: data.getPrice(),
            quantity: data.getQuantity()
        };
    }

}