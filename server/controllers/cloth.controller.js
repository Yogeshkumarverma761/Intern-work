import clothesModel from "../models/clothes.model.js";

const buildPriceRangeFilter = (priceRange) => {
  if (!priceRange) return {};

  const map = {
    "under-2000": { $lt: 2000 },
    "2000-5000": { $gte: 2000, $lt: 5000 },
    "5000-10000": { $gte: 5000, $lt: 10000 },
    "above-10000": { $gte: 10000 },
  };

  return map[priceRange] || {};
};

const getAllClothes = async (req, res) => {
  try {
    const {
      category,
      tag,
      featured,
      inStock,
      search,
      sort = "featured",
      priceRange,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = { $in: category.split(",").map((c) => c.trim()) };
    }

    if (tag) {
      filter.tags = { $in: tag.split(",").map((t) => t.trim()) };
    }

    if (featured === "true") filter.isFeatured = true;
    if (inStock === "true") filter.inStock = true;

    const priceQuery = buildPriceRangeFilter(priceRange);
    if (minPrice) priceQuery.$gte = Number(minPrice);
    if (maxPrice) priceQuery.$lte = Number(maxPrice);
    if (Object.keys(priceQuery).length) {
      filter.price = priceQuery;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortStage = { createdAt: -1 };
    switch (sort) {
      case "price-asc":
        sortStage = { price: 1 };
        break;
      case "price-desc":
        sortStage = { price: -1 };
        break;
      case "newest":
        sortStage = { createdAt: -1 };
        break;
      case "popular":
        sortStage = { rating: -1, reviewsCount: -1 };
        break;
      case "featured":
      default:
        sortStage = { isFeatured: -1, createdAt: -1 };
        break;
    }

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const skip = (pageNumber - 1) * pageSize;

    const [clothes, total] = await Promise.all([
      clothesModel
        .find(filter)
        .sort(sortStage)
        .skip(skip)
        .limit(pageSize),
      clothesModel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: clothes,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClothById = async (req, res) => {
  try {
    const cloth = await clothesModel.findById(req.params.id);

    if (!cloth)
      return res.status(404).json({ message: "Cloth not found" });

    res.json({ success: true, data: cloth });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopMeta = async (req, res) => {
  try {
    const [categories, priceStats, tags] = await Promise.all([
      clothesModel.distinct("category", { category: { $exists: true } }),
      clothesModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
      clothesModel.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const priceRange = priceStats[0] || { minPrice: 0, maxPrice: 0 };

    res.json({
      success: true,
      data: {
        categories,
        priceRange,
        tags: tags.map((t) => ({ label: t._id, count: t.count })),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCloth = async (req, res) => {
  try {
    // Admin check is already done in authAdmin middleware
    console.log("Admin User:", req.user);

    const {
      title,
      description,
      price,
      category,
      rating,
      reviewsCount,
      tags,
      isFeatured,
      inStock,
      fabrics,
      colors,
      designs,
    } = req.body;

    const parseList = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
          }
        } catch (_) {
          // fall back to comma-separated parsing
        }
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    };

    const host = `${req.protocol}://${req.get("host")}`;
    const uploadedImages = Array.isArray(req.files)
      ? req.files.map((file) => `${host}/uploads/${file.filename}`)
      : [];

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cloth = await clothesModel.create({
      title,
      description,
      price,
      category,
      images: uploadedImages.length ? uploadedImages : parseList(req.body.images),
      rating,
      reviewsCount,
      tags: parseList(tags),
      isFeatured,
      inStock,
      fabrics: parseList(fabrics),
      colors: parseList(colors),
      designs: parseList(designs),
    });
    console.log("Cloth Created:", cloth);

    res.status(201).json({ success: true, data: cloth });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Create Cloth Error:", err);
  }
};

const updateCloth = async (req, res) => {
  try {
    // Admin check is already done in authAdmin middleware
    const cloth = await clothesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cloth)
      return res.status(404).json({ message: "Cloth not found" });

    res.json({ success: true, data: cloth });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCloth = async (req, res) => {
  try {
    // Admin check is already done in authAdmin middleware
    const cloth = await clothesModel.findByIdAndDelete(req.params.id);

    if (!cloth)
      return res.status(404).json({ message: "Cloth not found" });

    res.json({ success: true, message: "Cloth deleted successfully" });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default { 
    getAllClothes,
    getClothById,
    createCloth,
    updateCloth,
  deleteCloth,
  getShopMeta
 };