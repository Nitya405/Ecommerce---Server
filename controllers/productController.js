import Product from '../models/productModel.js';

export const seedProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Beetroot Lip Balm',
        description: 'A nourishing lip balm that provides a natural pink tint and deep hydration.\n\nUse: Perfect for daily use to keep lips soft, moisturized, and naturally tinted.\nBenefits: Hydrates and repairs dry, chapped lips. Adds a subtle, natural color. Made with shea butter and beetroot extract for extra nourishment.',
        image: '/images/lipbalm.jpg',
        price: 199
      },
      {
        name: 'Neem & Tulsi Soap',
        description: 'A purifying herbal soap designed for acne-prone and sensitive skin.\n\nUse: Use daily to cleanse the face and body, especially for those with oily or acne-prone skin.\nBenefits: Deeply cleanses and removes impurities. Helps prevent breakouts. Soothes and calms irritated skin.',
        image: '/images/soap.jpg',
        price: 149
      },
      {
        name: 'Glow Face Pack',
        description: 'A revitalizing face pack made with Multani mitti, sandalwood, and rose.\n\nUse: Apply weekly to brighten complexion and tighten pores.\nBenefits: Brightens dull skin. Tightens pores. Refreshes and rejuvenates.',
        image: '/images/facemask.jpg',
        price: 229
      },
      {
        name: 'Organic Hair Oil',
        description: 'A blend of cold-pressed oils for deep nourishment and hair growth.\n\nUse: Massage into scalp and hair before washing, 1-2 times a week.\nBenefits: Strengthens hair roots. Reduces hair fall. Adds shine and softness.',
        image: '/images/hairoil.jpg',
        price: 349
      },
      {
        name: 'Rose Water Toner',
        description: 'A gentle, alcohol-free toner to refresh and soothe all skin types.\n\nUse: Spray or dab on face after cleansing, before moisturizer.\nBenefits: Hydrates and tones skin. Calms irritation. Prepares skin for further skincare.',
        image: '/images/rosewater.jpg',
        price: 159
      },
      {
        name: 'Charcoal Detox Soap',
        description: 'A deep-cleansing soap with activated charcoal and tea tree oil.\n\nUse: Use daily for face and body to control oil and prevent acne.\nBenefits: Removes toxins and impurities. Controls excess oil. Prevents breakouts.',
        image: '/images/charcoalsoap.jpg',
        price: 179
      },
      {
        name: 'Lavender Body Butter',
        description: 'A rich, whipped body butter with shea, cocoa butter, and lavender.\n\nUse: Apply after bath or whenever skin feels dry.\nBenefits: Deeply moisturizes and softens skin. Calms and relaxes senses. Soothes dry, irritated skin.',
        image: '/images/lavenderbutter.jpg',
        price: 279
      },
      {
        name: 'Aloe Vera Gel',
        description: 'A pure aloe vera gel for multi-purpose skin and hair care.\n\nUse: Apply to face, body, or scalp as needed for soothing and hydration.\nBenefits: Soothes sunburn and irritation. Hydrates skin and scalp. Promotes healing.',
        image: '/images/aloegel.jpg',
        price: 199
      },
      {
        name: 'Coffee Scrub',
        description: 'An exfoliating body scrub made with coffee and coconut oil.\n\nUse: Massage onto damp skin in the shower, then rinse.\nBenefits: Removes dead skin cells. Improves circulation. Leaves skin smooth and glowing.',
        image: '/images/coffeescrub.jpg',
        price: 249
      },
      {
        name: 'Herbal Kajal',
        description: 'A natural, smudge-proof kajal for beautiful, defined eyes.\n\nUse: Apply gently to the waterline or lash line.\nBenefits: Safe for sensitive eyes. Long-lasting and cooling. Made with castor oil and camphor.',
        image: '/images/kajal.jpg',
        price: 99
      },
      {
        name: 'Turmeric Night Cream',
        description: 'A brightening night cream with turmeric and saffron.\n\nUse: Apply to clean face before bed.\nBenefits: Fades dark spots. Evens skin tone. Nourishes overnight.',
        image: '/images/turmericcream.jpg',
        price: 299
      },
      {
        name: 'Sandal Face Wash',
        description: 'A gentle cleanser with sandalwood and honey for daily use.\n\nUse: Use morning and night to cleanse face.\nBenefits: Cleanses without drying. Soothes and softens skin. Suitable for all skin types.',
        image: '/images/sandalfacewash.jpg',
        price: 179
      },
      {
        name: 'Minty Foot Cream',
        description: 'A cooling foot cream with peppermint and shea butter.\n\nUse: Massage into feet before bed or after a long day.\nBenefits: Relieves tired, aching feet. Softens rough skin. Refreshes and cools.',
        image: '/images/mintyfootcream.jpg',
        price: 189
      },
      {
        name: 'Coconut Milk Shampoo',
        description: 'A gentle, sulfate-free shampoo with coconut milk.\n\nUse: Apply to wet hair, lather, and rinse.\nBenefits: Cleanses gently. Adds shine and softness. Prevents dryness.',
        image: '/images/coconutshampoo.jpg',
        price: 259
      },
      {
        name: 'Berry Bliss Lip Scrub',
        description: 'An exfoliating lip scrub with real berry extracts and sugar crystals.\n\nUse: Gently massage onto lips, then rinse or wipe off.\nBenefits: Removes dead skin. Smooths and softens lips. Enhances natural lip color.',
        image: '/images/berrylipscrub.jpg',
        price: 129
      }
    ];

    await Product.deleteMany(); // clear old
    await Product.insertMany(sampleProducts); // insert new
    res.status(200).json({ message: '✅ Products seeded successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update getProducts to only return non-deleted products
export const getProducts = async (req, res) => {
  try {
    let products;
    if (req.query.all) {
      products = await Product.find();
    } else {
      products = await Product.find({ deleted: false });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update getProductById to check deleted
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, deleted: false });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const newProduct = new Product({ name, description, price, image, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update deleteProduct to soft delete
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.deleted = true;
    await product.save();
    res.status(200).json({ message: 'Product deleted (soft) successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add restoreProduct controller
export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.deleted = false;
    await product.save();
    res.status(200).json({ message: 'Product restored successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
