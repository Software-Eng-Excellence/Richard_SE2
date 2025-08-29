import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../Cake.model";

export class CakeBuilder {

   
    private type!: string;
    private flavor!: string;
    private filling!: string;
    private size!: number;
    private layers!: number;
    private frostingType!: string;
    private frostingFlavor!: string;
    private decorationType!: string;
    private decorationColor!: string;
    private customMessage!: string;
    private shape!: string;
    private Allergies!: string;
    private SpecialIngredients!: string;
    private PackagingType!: string;
    

    public static newBuilder(): CakeBuilder {
        return new CakeBuilder();
    }

    setType(type: string): CakeBuilder {
        this.type = type;
        return this;
    }
    setFlavor(flavor: string): CakeBuilder {
        this.flavor = flavor;
        return this;
    }
    setFilling(filling: string): CakeBuilder {
        this.filling = filling;
        return this;
    }
    setSize(size: number): CakeBuilder {
        this.size = size;
        return this;
    }
    setLayers(layers: number): CakeBuilder {
        this.layers = layers;
        return this;
    }
    setFrostingType(frostingType: string): CakeBuilder {
        this.frostingType = frostingType;
        return this;
    }
    setFrostingFlavor(frostingFlavor: string): CakeBuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }
    setDecorationType(decorationType: string): CakeBuilder {
        this.decorationType = decorationType;
        return this;
    }
    setDecorationColor(decorationColor: string): CakeBuilder {
        this.decorationColor = decorationColor;
        return this;
    }
    setCustomMessage(customMessage: string): CakeBuilder {
        this.customMessage = customMessage;
        return this;
    }
    setShape(shape: string): CakeBuilder {
        this.shape = shape;
        return this;
    }
    setAllergies(Allergies: string): CakeBuilder {
        this.Allergies = Allergies;
        return this;
    }
    setSpecialIngredients(SpecialIngredients: string): CakeBuilder {
        this.SpecialIngredients = SpecialIngredients;
        return this;
    }
    setPackagingType(PackagingType: string): CakeBuilder {
        this.PackagingType = PackagingType;
        return this;
    }
 

    build(): Cake {
        const required = [
         
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.shape,
            this.PackagingType,
           
        ];
        for (const prop of required) {
            if (prop === undefined || prop === null) {
                throw new Error("Missing required cake property");
            }
        }
        return new Cake(
          
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.Allergies,
            this.SpecialIngredients,
            this.PackagingType,
        
        );
    }

}

export class IdentifiableCakeBuilder extends CakeBuilder {
    private id!: string;
    private cake!: Cake;


   
     static newBuilder(): IdentifiableCakeBuilder {
        return new IdentifiableCakeBuilder();
    }

   setCake(cake: Cake):IdentifiableCakeBuilder
   {
       this.cake = cake;
      return this;
       
   }
     setId(id: string) : IdentifiableCakeBuilder{
        this.id=id;
        return this;

    }

   build(): IdentifiableCake {
    if(!this.id || !this.cake) {
        logger.error("Missing required properties");
        throw new Error("Missing required properties");
    }
    return new IdentifiableCake(
        this.id,
        this.cake.getType(),
        this.cake.getFlavor(),
        this.cake.getFilling(),
        this.cake.getSize(),      
        this.cake.getLayers(),
        this.cake.getFrostingType(),
        this.cake.getFrostingFlavor(),
        this.cake.getDecorationType(),
        this.cake.getDecorationColor(),
        this.cake.getCustomMessage(),
        this.cake.getShape(),
        this.cake.getAllergies(),
        this.cake.getSpecialIngredients(),
        this.cake.getPackagingType()
    );


}
}