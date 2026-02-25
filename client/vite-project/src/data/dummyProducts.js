// Dummy products with design variations
// Each design has a different image for the same dress
import VFull from "../../public/CasualSuit/VFull.png"
import VHalf from "../../public/CasualSuit/VHalf.png"
import RFull from "../../public/CasualSuit/RFull.png"
import RHalf from "../../public/CasualSuit/RHalf.png"
import RkFull from "../../public/Kurta/RkFull.png"
import RkHalf from "../../public/Kurta/RkHalf.png"
import VkFull from "../../public/Kurta/VkFull.png"
import VkHalf from "../../public/Kurta/VkHalf.png"
import RfFull from "../../public/Floral/RfFull.png"
import RfHalf from "../../public/Floral/RfHalf.png"
import VfFull from "../../public/Floral/VfFull.png"
import VfHalf from "../../public/Floral/VfHalf.png"

export const dummyProducts = [
  {
    _id: "dummy-1",
    title: "Casual Suit Set",
    name: "Casual Suit Set",
    category: "Suits",
    price: 3500,
    originalPrice: 4500,
    rating: 4.5,
    reviewsCount: 128,
    description: "An easygoing casual suit set with clean lines and subtle tailoring. Pick your neckline and sleeve length to suit the occasion.",
    tags: ["Made to fit you", "Premium materials", "Quality assured"],
    colors: ["Black", "White", "Navy", "Beige"],
    fabrics: ["Cotton", "Linen", "Cotton Blend"],
    designs: [
      {
        name: "Round Neck Half Sleeves",
        image: RHalf
      },
      {
        name: "Round Neck Full Sleeves",
        image: RFull
      },
      {
        name: "V-Neck Half Sleeves",
        image: VHalf
      },
      {
        name: "V-Neck Full Sleeves",
        image: VFull
      }
    ],
    images: [
        RHalf,
    ]
  },
  {
    _id: "dummy-2",
    title: "Classic Kurta Set",
    name: "Classic Kurta Set",
    category: "Kurtas",
    price: 8500,
    originalPrice: 10500,
    rating: 4.8,
    reviewsCount: 256,
    description: "A refined kurta set crafted for traditional comfort with a modern finish. Choose round or V necklines with your preferred sleeves.",
    tags: ["Made to fit you", "Premium materials", "Quality assured"],
    colors: ["Navy", "Black", "Burgundy", "Gold"],
    fabrics: ["Silk", "Silk Blend", "Satin"],
    designs: [
      {
        name: "Round Neck Full Sleeves",
        image: RkFull
      },
      {
        name: "Round Neck Sleeveless",
        image: RkHalf
      },
      {
        name: "V Neck Full Sleeves",
        image: VkFull
      },
      {
        name: "V Neck Sleeveless",
        image: VkHalf
      }
    ],
    images: [
      VkFull,
    ]
  },
  {
    _id: "dummy-3",
    title: "Floral Dress",
    name: "Floral Dress",
    category: "Dresses",
    price: 2800,
    originalPrice: 3800,
    rating: 4.6,
    reviewsCount: 189,
    description: "A soft floral dress with a breezy feel. Switch between round or V necklines and sleeve lengths for the right look.",
    tags: ["Made to fit you", "Premium materials", "Quality assured"],
    colors: ["White", "Light Blue", "Pink", "Gray"],
    fabrics: ["Cotton", "Cotton Blend", "Linen"],
    designs: [
      {
        name: "Round Neck Full Sleeves",
        image: RfFull
      },
      {
        name: "Round Neck Sleeveless",
        image: RfHalf
      },
      {
        name: "V Neck Full Sleeves",
        image: VfFull
      },
      {
        name: "V Neck Sleeveless",
        image: VfHalf
      }
    ],
    images: [
      RfFull
    ]
  }
];

export default dummyProducts;
