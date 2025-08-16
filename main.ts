import { Cake } from "./model/Cake.model";
import { Order } from "./model/Order.model";
import{Book} from "./model/Book.model";
import { Toy } from "./model/Toy.model";


const cake = new Cake(1, 'birthday', 'chocolate', 'vanilla', 'medium', 2, 'buttercream', 'chocolate', 'sprinkles', 'Happy Birthday!');
const order = new Order(cake, 100, 1, '123');


const book = new Book(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Novel', 10.99);
const order2 = new Order(book, 10.99, 1, '124');

const toy = new Toy(1, 'Action Figure', 3, 10, 'A cool action figure');
const order3 = new Order(toy, 15.99, 1, '125' );