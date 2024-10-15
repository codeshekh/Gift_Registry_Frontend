interface Product {
    description: string;
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    amazonUrl: string;
    flipkartUrl: string;
    
  }
  
  interface Category {
    id: number;
    categoryName: string;
    products: Product[];
    imageUrl: string;
    
  }
  
  export const categories: Category[] = [
    {
      id: 1,
      categoryName: "Birthday Gift's For Kids",
      products: [
        { id: 1, name: "Football", price: 949, imageUrl: "/products/football.jpg", amazonUrl: "https://www.amazon.in/Nivia-Shining-Star-2022-Football-White/dp/B00IAPK0S4/ref=cm_gf_aKF_d_p0_e0_qd0_KXD4G41GtK9c1DG2nK8d?sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&th=1", flipkartUrl: "https://www.flipkart.com/nivia-shining-star-2022-football-size-5/p/itmf9ghr9yyfwkmg?pid=BALF4C2RGZAHVNXZ&lid=LSTBALF4C2RGZAHVNXZBSVXF3&marketplace=FLIPKART&cmpid=content_ball_8965229628_gmc", description: "Nivia Shining Star - 2022 Football/Rubberized Stitched Football/32 Panels/International Match Ball/Size - 5 (Black & White)" },
        { id: 2, name: "Action Figure", price: 29.99, imageUrl: "/home.jpg",  amazonUrl: "https://amazon.com/action-figure", flipkartUrl: "https://flipkart.com/action-figure", description: ""  },
      ],
      imageUrl: "/products/kidsbirth.jpg",
    
    },
    {
      id: 2,
      categoryName: "Electronics",
      products: [
        { id: 3, name: "Smartphone", price: 399.99, imageUrl: "/home.jpg", amazonUrl: "https://amazon.com/smartphone", flipkartUrl: "https://flipkart.com/smartphone",description: ""  },
        { id: 4, name: "Laptop", price: 999.99, imageUrl: "/home.jpg", amazonUrl: "https://amazon.com/laptop", flipkartUrl: "https://flipkart.com/laptop",description: ""  },
      ],
      imageUrl: "/home.jpg",
    
    }
  ];
  