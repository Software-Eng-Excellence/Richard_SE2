// import { OrderManagement , FinanceCalculator, Order } from "../src/app";
// import { Validator } from "../src/app";
// describe("OrderManagement", () => {
//     //before all, new validator and new calculator
//     //before each m new order manager
//     let validator: Validator;
//     let calculator: FinanceCalculator;
//     let orderManager: OrderManagement;
//     let baseValidator: (order : Order) => void;


//     beforeAll(() => {
    
//         validator=new Validator();
//         calculator=new FinanceCalculator();

//     });
//     beforeEach(()=>{
//          baseValidator = validator.validate;
//          validator.validate = jest.fn();
//          orderManager = new OrderManagement(validator, calculator); 
//     }
//     );
  
//     it("should add an order", () => {
//         //Arrange
       
       
//         const item = "Sponge";
//         const price= 15;
        
//         //Act
//         orderManager.addOrder(item, price);  
        

//         //Assert
//         expect(orderManager.getOrders()).toEqual([{id: 1, item, price }]);
//     });
//     it("should get an order",()=>{
//         //Arrange
       

      
//         const item = "Sponge";
//         const price= 15;

//         //Act
//         orderManager.addOrder(item, price);  

//         //Assert
//         expect(orderManager.getOrder(1)).toEqual({id: 1, item, price }); 
//     })
//     it("Should call finance calculator getRevenue",() =>{
//         //Arrange 
//         const item ="Sponge";
//         const price = 15;
//         orderManager.addOrder(item, price);
//         const spy = jest.spyOn(calculator, "getRevenue");
         
      
//         //Act
//         orderManager.getTotalRevenue();

//         //Assert
//         expect(spy).toHaveBeenCalled();
//         expect(spy).toHaveBeenCalledWith([{id: 1, item, price }]);
//         expect(spy).toHaveBeenCalledTimes(1);

//     });
//     it("should throw addition exception if validator does not pass",() => {
//         //Arrange 
//         const item = "Sponge";
//         const price = 22;
//       jest.spyOn(validator, "validate").mockImplementation(() => {
//   throw new Error("Invalidation order");

//     });

       

//         //Assert
//         expect(() => orderManager.addOrder(item,price)).toThrow("[OrderManagement]  Error adding orders: Invalidation order"); 

//     });
// });

// describe("FinanceCalculator", () => {
//     it("should calculate total price", () => {
//         //Arrange
       
//         const calculator = new FinanceCalculator();

//         const orders = [
//             {id: 1, item: "Sponge", price: 15}, 
//             {id: 2, item: "Mop", price: 25  },
//             {id:3, item: "Bucket", price: 30 }

//         ];
//         //act 
//         const revenue = calculator.getRevenue(orders);

//         //assert
//         expect(revenue).toEqual(70);        

//     });
//     it("Should get the average buy power",() =>{
//         //Arrange 
//         const calc = new FinanceCalculator();
//         const orders = [
//             {id: 1, item: "Sponge", price: 15}, 
//             {id: 2, item: "Mop", price: 25  },
//             {id:3, item: "Bucket", price: 30 }

//         ];
//         //Act
//         const average = calc.getAverageBuyPower(orders);

//         //Assert
//         expect(average).toBeCloseTo(23.33,2);
//     })
// }); 