
import { CSVCakeMapper } from "../../mappers/Cake.mappers";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { IOrder } from "../../model/IOrder";
import { OrderRepository } from "./Order.repository";
import { readCSVFile,writeCSVFile } from "../../parsers/csvParser";
import { DbException } from "../../util/exceptions/repositoryException";
import { IMapper } from "../../mappers/IMapper";
import { Cake, IdentifiableCake } from "../../model/Cake.model";
import { CakeBuilder, IdentifiableCakeBuilder } from "../../model/Builder/cake.builder";




export class CakeOrderRepository extends OrderRepository{
    private mapper = new CSVOrderMapper(new CSVCakeMapper());
    constructor(private readonly filePath: string) {
        super();
    }

    // Implement the abstract methods from IOrderRepository // convert to string
    protected async load(): Promise<IOrder[]> {
        try{

            const csv = await readCSVFile(this.filePath);
            return csv.map(row => this.mapper.map(row));
            
        }catch(error: unknown){
            // logger.error("Error loading cake orders", error);
            throw new DbException("Failed to load orders",error as Error);
        }
 
    }
    // to csv
    protected async save(orders: IOrder[]): Promise<void> {
        try{

              const header = [
            "id",
            "type",
            "flavor",
            "filling",
            "size",
            "layers",
            "frostingType",
            "frostingFlavor",
            "decorationType",
            "decorationColor",
            "customMessage",
            "shape",
            "allergies",
            "specialIngredients",
            "packagingType"
        ];
        const rawItems = orders.map(o => new CSVCakeMapper().reverse(o as any));
        return writeCSVFile(this.filePath, [header, ...rawItems]);

        }
        // Save orders to a file or database
        // This is just a placeholder implementation
      
        catch(error: unknown){
            // logger.error("Error loading cake orders", error);
            throw new DbException("Failed to load orders",error as Error);
        }
    }
}
export interface SQLiteCake {
      id:string;
      type:string;
      flavor:string;
      filling:string;
      size:string;
      layers:number;
      frostingType:string;
      frostingFlavor:string;
      decorationType:string;
      decorationColor:string;
      customMessage:string;
      shape:string;
      allergies:string;
      specialIngredients:string;
      packagingType:string;
}
export class SqliteCakeMapper implements IMapper<SQLiteCake, IdentifiableCake> {
    map(data: SQLiteCake): IdentifiableCake {
            return IdentifiableCakeBuilder.newBuilder()
            
                 .setCake(CakeBuilder.newBuilder()
                .setType(data.type)
                .setFlavor(data.flavor)
                .setFilling(data.filling)
                .setSize(Number(data.size))
                .setLayers(data.layers)
                .setFrostingType(data.frostingType)
                .setFrostingFlavor(data.frostingFlavor)
                .setDecorationType(data.decorationType)
                .setDecorationColor(data.decorationColor)
                .setCustomMessage(data.customMessage)
                .setShape(data.shape)
                .setAllergies(data.allergies)
                .setSpecialIngredients(data.specialIngredients)
                .setPackagingType(data.packagingType)
                .build())
            .setId(data.id)
            .build();
    }

    reverse(data: IdentifiableCake): SQLiteCake {
        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: String(data.getSize()),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}
   

