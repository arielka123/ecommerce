import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] =[];
  currentCategoryId: number =1;
  previousCategoryId: number=1;
  currentCategoryName: string ="";
  searchMode: boolean = false;

  //new properties fir pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number= 0;

  previousKeyword: string =""

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){

      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a diffrent keywird than previ{uos
    if(this.previousKeyword != theKeyword){
      this.thePageNumber=1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    //search for products using the given keyword
    // this.productService.searchProducts(theKeyword).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )

    this.productService.searchProductsPaginate(this.thePageNumber -1, 
                                              this.thePageSize, 
                                              theKeyword)
                                              .subscribe(this.processResult());

  }

  handleListProducts(){

   //check if "id" parameter is available
   const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

   if(hasCategoryId){
     //get the "id" param string. convert string ti a number using the "+" symbol
     this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
   }
   else{
     //not category id available .. default to category id 1
     this.currentCategoryId = 1;
     this.currentCategoryName ="Books";
   }
 
   //checked if we have a diffrent category than previus
   //note: angular will resuse a component f it is currently being viewed
   //

   //if we have a diffrent categogry than previus
   //then set thePageNumber back to 1
   if(this.previousCategoryId != this.currentCategoryId){
    this.thePageNumber = 1;
   }

   this.previousCategoryId = this.currentCategoryId;

   console.log(`current: ${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


   //get products fir the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //  data =>{
    //    this.products = data;
    //  }
    // )

    this.productService.getProductListPaginate(this.thePageNumber -1, 
                                               this.thePageSize, 
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());

  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber =1;
    this.listProducts();
    }

  processResult(){
    return(data: any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

}
