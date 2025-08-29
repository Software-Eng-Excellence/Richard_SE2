import { ToyBuilder } from "../model/Builder/toy.builder";
import { Toy } from "../model/Toy.models";
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
            .setOrderID(orderID ? Number(orderID) : 0)
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
                <OrderID>${data.getOrderID()}</OrderID>
                <Type>${data.getType()}</Type>
                <AgeGroup>${data.getAgeGroup()}</AgeGroup>
                <Brand>${data.getBrand()}</Brand>
                <Material>${data.getMaterial()}</Material>
                <BatteryRequired>${data.isBatteryRequired()}</BatteryRequired>
                <Educational>${data.isEducational()}</Educational>
                <Price>${data.getPrice()}</Price>
                <Quantity>${data.getQuantity()}</Quantity>
            </Toy>`;
                    
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, "application/xml");
    }
}