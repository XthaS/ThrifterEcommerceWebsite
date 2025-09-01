const express = require("express");
const Product = require("../models/Product");
const{protect,admin} =require("../middleware/authMiddleware");
const mongoose = require("mongoose");


const router = express.Router();

//@route POST /api/products
//@desc Create a new product
//@access Private/Admin
router.post("/",protect, admin, async(req,res)=>{
    try{
        const {
            name,
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
        }=req.body;

        const product = new Product(
            {
            name,
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            user:req.user._id, //Reference to admin user who created it
        }
        );

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
        }catch (error){
        console.error(error);
        res.status(500).send("Server Error");
        }
    });


    //@route PUT/ api/products/:id
    //@desc Update an existing product ID
    //@access Private/Admin
    router.put("/:id", protect,admin,async(req,res)=>{
        try {
            const {
            name,
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
        }=req.body;
            //find product by ID
            const product =await Product.findById(req.params.id);

            if (product){
                //Update product fields
                product.name=name || product.name;
                product.description=description || product.description;
                product.price=price || product.price;
                product.discountPrice=discountPrice || product.discountPrice;
                product.countInStock=countInStock|| product.countInStock;
                product.category=category || product.category;
                product.brand=brand || product.brand;
                product.sizes=sizes || product.sizes;
                product.colors=colors || product.colors;
                product.collections=name || product.collections;
                product.material=material || product.material;
                product.gender=gender || product.gender;
                product.images=images || product.images;
                product.isFeatured = 
                isFeatured !== undefined ? isFeatured : product.isFeatured;
                product.isPublished = 
                isPublished !== undefined ? isPublished : product.isPublished;
                product.tags=tags || product.tags;
                product.dimensions=dimensions || product.dimensions;
                product.weight=weight || product.weight;

                //save the updated product
                const updatedProduct = await product.save();
                res.json(updatedProduct);
            }else {
                res.status(404).json({message:"Product not found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    });

    //@route DELETE/api/products/:id
    //@desc Delete a product by ID
    //@access Private/Admin
    router.delete("/:id",protect,admin,async(req,res)=>{
        try{
            //find the product by ID
            const product = await Product.findById(req.params.id);

            if (product) {
                //remove from product from database
                await product.deleteOne();
                res.json({message:"Product removed"});
            } else {
                res.status(404).json({message: "Product not found"});
            }
        } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        }
    });

    //@route GET /api/products
    //@desc Get all products with optional query filters
    //@access Public 
    router.get("/",async(req,res)=>{
        try {
            const{
                collection,
                size,
                color,
                gender,
                minPrice,
                maxPrice,
                sortBy,
                search,
                category,
                material,
                brand,
                limit}=req.query;

                let query= {};

                //Filter Logic
                if(collection && collection.toLowerCase() !== "all"){
                    query.collections = collection;
                }

                if(category && category.toLocaleLowerCase()!=="all"){
                    query.category = category;
                }

                if(material) {
                    query.material ={$in:material.split(",")};
                }

                 if(brand) {
                    query.brand ={$in:brand.split(",")};
                }

                 if(size) {
                    query.size ={$in:size.split(",")};
                }

                 if(color) {
                    query.colors ={$in:[color]};
                }

                 if(gender) {
                    query.gender =gender;
                }

                 if(minPrice || maxPrice) {
                    query.price ={};
                    if(minPrice) query.price.$gte = Number(minPrice);
                    if(maxPrice) query.price.$lte = Number(maxPrice);
                }

                if(search ){
                    query.name = { $regex: search, $options: "i" };
                }

                //sort logic by query parameter
                let sort = {};
                if(sortBy){
                    switch (sortBy){
                        case "priceAsc":
                            sort ={price:1};
                            break;
                            case"priceDesc":
                            sort ={price:-1};
                            break;
                            case"popularity":
                            sort ={rating: -1};
                            break;
                            default:
                            break;

                    }
                }

                //Fetch products and apply sorting limit
                let products =await Product.find(query)
                .sort(sort)
                .limit(Number(limit)||0);
                res.json(products);            
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    });

       //@route GET /api/products/best-seller
    //@desc Retrieve the product with highest rating, or a random product if none found
    //@access Public
    router.get("/best-seller", async (req, res) => {
        try {
            let bestSeller = await Product.findOne().sort({ rating: -1 });
            if (!bestSeller) {
                // If no product with rating, return a random product
                const allProducts = await Product.find();
                if (allProducts.length > 0) {
                    bestSeller = allProducts[Math.floor(Math.random() * allProducts.length)];
                }
            }
            if (bestSeller) {
                res.json(bestSeller);
            } else {
                res.status(404).json({ message: "No best seller found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    });

//@route GET /api/products/new-arrivals
    // @desc retrieve latest 8 products - Creation date
    //@access Public 
    router.get("/new-arrivals",async(req,res)=>{
        try{
            const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);  
            res.json(newArrivals);  
        }catch (error){
            console.error(error);
            res.status(500).send("Server Error");
        }
    })
    //@route GET /api/products/:id
    //@desc Get a single product by ID
    //@access Public
    router.get("/:id",async(req,res)=>{
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
            const product =await Product.findById(req.params.id);
            if (product){
                res.json(product);
            } else {
                res.status(404).json({message:"Product not found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
            
        }
    });

    //@route GET /api/products/similar/:id
    //@desc Retrieve similar products based on current product's gender and category
    //@access Public
    router.get("/similar/:id",async (req,res) =>{
        const {id} =req.params;
        try {
            const product = await Product.findById(id);

            if(!product){
                return res.status(404).json({message:"Product not found"});
            }

            const similarProducts = await Product.find({

                _id: {$ne:id}, //exclude the current product ID
                gender:product.gender,
                category:product.category,
            }).limit(4);

            res.json(similarProducts);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
            
        }

    });

// @route GET /api/products/:id/recommendations
// @desc Get top N similar products based on TF-IDF enhanced content features
// @access Public
router.get('/:id/recommendations', async (req, res) => {
    try {
        const NUM_RECOMMENDATIONS = 4; // Number of recommendations to return
        const productId = req.params.id;
        const allProducts = await Product.find();
        const selectedProduct = allProducts.find(p => p._id.toString() === productId);
        
        if (!selectedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Helper: Build a feature string for a product
        function featureString(product) {
            return [
                product.category || '',
                product.brand || '',
                (product.sizes || []).join(' '),
                product.material || '',
                product.gender || ''
            ].join(' ').toLowerCase();
        }

        // Calculate document frequency (DF) for all words across all products
        const wordDocumentFreq = {};
        allProducts.forEach(product => {
            const words = featureString(product).split(/\s+/);
            const uniqueWords = new Set(words.filter(word => word.length > 0));
            uniqueWords.forEach(word => {
                wordDocumentFreq[word] = (wordDocumentFreq[word] || 0) + 1;
            });
        });

        // TF-IDF Vectorization
        function tfidfVectorize(product) {
            const words = featureString(product).split(/\s+/);
            const freq = {};
            
            words.forEach(word => {
                if (word && word.length > 0) {
                    // Term Frequency (TF) - count of word in this document
                    const tf = (freq[word] || 0) + 1;
                    
                    // Document Frequency (DF) - number of documents containing this word
                    const df = wordDocumentFreq[word] || 1;
                    
                    // Inverse Document Frequency (IDF) - log of total docs / docs with word
                    const idf = Math.log(allProducts.length / df);
                    
                    // TF-IDF score
                    freq[word] = tf * idf;
                }
            });
            return freq;
        }

        // Helper: Compute cosine similarity between two TF-IDF vectors
        function cosineSim(vecA, vecB) {
            const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
            let dot = 0, magA = 0, magB = 0;
            
            allWords.forEach(word => {
                const a = vecA[word] || 0;
                const b = vecB[word] || 0;
                dot += a * b;
                magA += a * a;
                magB += b * b;
            });
            
            if (magA === 0 || magB === 0) return 0;
            return dot / (Math.sqrt(magA) * Math.sqrt(magB));
        }

        // Vectorize the selected product using TF-IDF
        const selectedVec = tfidfVectorize(selectedProduct);
        
        // Compute similarity for all other products with the same gender and category
        const similarities = allProducts
            .filter(p =>
                p._id.toString() !== productId &&
                p.gender === selectedProduct.gender &&
                p.category === selectedProduct.category
            )
            .map(p => ({
                product: p,
                score: cosineSim(selectedVec, tfidfVectorize(p))
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, NUM_RECOMMENDATIONS)
            .map(item => item.product);

        res.json(similarities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/products/:id/recommendations/compare
// @desc Compare old bag-of-words vs new TF-IDF recommendations
// @access Public
router.get('/:id/recommendations/compare', async (req, res) => {
    try {
        const NUM_RECOMMENDATIONS = 4;
        const productId = req.params.id;
        const allProducts = await Product.find();
        const selectedProduct = allProducts.find(p => p._id.toString() === productId);
        
        if (!selectedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Helper: Build a feature string for a product
        function featureString(product) {
            return [
                product.category || '',
                product.brand || '',
                (product.sizes || []).join(' '),
                product.material || '',
                product.gender || ''
            ].join(' ').toLowerCase();
        }

        // OLD ALGORITHM: Simple bag-of-words vectorization
        function bagOfWordsVectorize(str) {
            const words = str.split(/\s+/);
            const freq = {};
            words.forEach(word => {
                if (word) freq[word] = (freq[word] || 0) + 1;
            });
            return freq;
        }

        // NEW ALGORITHM: TF-IDF vectorization
        const wordDocumentFreq = {};
        allProducts.forEach(product => {
            const words = featureString(product).split(/\s+/);
            const uniqueWords = new Set(words.filter(word => word.length > 0));
            uniqueWords.forEach(word => {
                wordDocumentFreq[word] = (wordDocumentFreq[word] || 0) + 1;
            });
        });

        function tfidfVectorize(product) {
            const words = featureString(product).split(/\s+/);
            const freq = {};
            
            words.forEach(word => {
                if (word && word.length > 0) {
                    const tf = (freq[word] || 0) + 1;
                    const df = wordDocumentFreq[word] || 1;
                    const idf = Math.log(allProducts.length / df);
                    freq[word] = tf * idf;
                }
            });
            return freq;
        }

        // Cosine similarity function
        function cosineSim(vecA, vecB) {
            const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
            let dot = 0, magA = 0, magB = 0;
            
            allWords.forEach(word => {
                const a = vecA[word] || 0;
                const b = vecB[word] || 0;
                dot += a * b;
                magA += a * a;
                magB += b * b;
            });
            
            if (magA === 0 || magB === 0) return 0;
            return dot / (Math.sqrt(magA) * Math.sqrt(magB));
        }

        // Get recommendations using OLD algorithm (bag-of-words)
        const selectedVecOld = bagOfWordsVectorize(featureString(selectedProduct));
        const oldRecommendations = allProducts
            .filter(p => p._id.toString() !== productId)
            .map(p => ({
                product: p,
                score: cosineSim(selectedVecOld, bagOfWordsVectorize(featureString(p)))
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, NUM_RECOMMENDATIONS)
            .map(item => ({ 
                ...item.product.toObject(), 
                similarityScore: item.score,
                algorithm: 'bag-of-words'
            }));

        // Get recommendations using NEW algorithm (TF-IDF)
        const selectedVecNew = tfidfVectorize(selectedProduct);
        const newRecommendations = allProducts
            .filter(p => p._id.toString() !== productId)
            .map(p => ({
                product: p,
                score: cosineSim(selectedVecNew, tfidfVectorize(p))
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, NUM_RECOMMENDATIONS)
            .map(item => ({ 
                ...item.product.toObject(), 
                similarityScore: item.score,
                algorithm: 'tf-idf'
            }));

        res.json({
            selectedProduct: {
                name: selectedProduct.name,
                category: selectedProduct.category,
                brand: selectedProduct.brand,
                material: selectedProduct.material,
                gender: selectedProduct.gender,
                sizes: selectedProduct.sizes
            },
            oldAlgorithm: {
                name: 'Bag-of-Words',
                description: 'Simple frequency-based vectorization',
                recommendations: oldRecommendations
            },
            newAlgorithm: {
                name: 'TF-IDF',
                description: 'Term Frequency-Inverse Document Frequency vectorization',
                recommendations: newRecommendations
            },
            comparison: {
                differences: newRecommendations.filter((newRec, index) => {
                    const oldRec = oldRecommendations[index];
                    return newRec._id.toString() !== oldRec._id.toString();
                }).length,
                totalRecommendations: NUM_RECOMMENDATIONS
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/products/cart-recommendations
// @desc Get recommendations based on cart items using TF-IDF and cosine similarity
// @access Public
router.get('/cart-recommendations', async (req, res) => {
    try {
        const NUM_RECOMMENDATIONS = 8; // Return 8 recommendations for "You May Also Like"
        const { cartItems } = req.query; // Expect cart items as query parameter
        
        if (!cartItems) {
            // If no cart items, return random products
            const allProducts = await Product.find({ isPublished: true, isAvailable: true });
            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            return res.json(shuffled.slice(0, NUM_RECOMMENDATIONS));
        }

        let cartProductIds;
        try {
            cartProductIds = JSON.parse(cartItems);
            if (!Array.isArray(cartProductIds) || cartProductIds.length === 0) {
                // If cart items is empty array, return random products
                const allProducts = await Product.find({ isPublished: true, isAvailable: true });
                const shuffled = allProducts.sort(() => 0.5 - Math.random());
                return res.json(shuffled.slice(0, NUM_RECOMMENDATIONS));
            }
        } catch (parseError) {
            console.error('Error parsing cartItems:', parseError);
            // If parsing fails, return random products
            const allProducts = await Product.find({ isPublished: true, isAvailable: true });
            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            return res.json(shuffled.slice(0, NUM_RECOMMENDATIONS));
        }
        const allProducts = await Product.find({ isPublished: true, isAvailable: true });
        
        // Get cart products
        const cartProducts = allProducts.filter(p => cartProductIds.includes(p._id.toString()));
        
        if (cartProducts.length === 0) {
            // If cart products not found, return random products
            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            return res.json(shuffled.slice(0, NUM_RECOMMENDATIONS));
        }

        // Determine gender preference from cart
        const cartGenders = [...new Set(cartProducts.map(p => p.gender).filter(Boolean))];
        const hasMultipleGenders = cartGenders.length > 1;
        
        // Helper: Build a feature string for a product (same as existing function)
        function featureString(product) {
            return [
                product.category || '',
                product.brand || '',
                (product.sizes || []).join(' '),
                product.material || '',
                product.gender || ''
            ].join(' ').toLowerCase();
        }

        // Calculate document frequency (DF) for all words across all products
        const wordDocumentFreq = {};
        allProducts.forEach(product => {
            const words = featureString(product).split(/\s+/);
            const uniqueWords = new Set(words.filter(word => word.length > 0));
            uniqueWords.forEach(word => {
                wordDocumentFreq[word] = (wordDocumentFreq[word] || 0) + 1;
            });
        });

        // TF-IDF Vectorization (same as existing function)
        function tfidfVectorize(product) {
            const words = featureString(product).split(/\s+/);
            const freq = {};
            
            words.forEach(word => {
                if (word && word.length > 0) {
                    const tf = (freq[word] || 0) + 1;
                    const df = wordDocumentFreq[word] || 1;
                    const idf = Math.log(allProducts.length / df);
                    freq[word] = tf * idf;
                }
            });
            return freq;
        }

        // Cosine similarity function (same as existing function)
        function cosineSim(vecA, vecB) {
            const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
            let dot = 0, magA = 0, magB = 0;
            
            allWords.forEach(word => {
                const a = vecA[word] || 0;
                const b = vecB[word] || 0;
                dot += a * b;
                magA += a * a;
                magB += b * b;
            });
            
            if (magA === 0 || magB === 0) return 0;
            return dot / (Math.sqrt(magA) * Math.sqrt(magB));
        }

        // Create a combined feature vector from all cart items
        const combinedCartFeatures = cartProducts.map(p => featureString(p)).join(' ');
        const combinedCartVec = tfidfVectorize({ 
            category: combinedCartFeatures,
            brand: cartProducts.map(p => p.brand).filter(Boolean).join(' '),
            sizes: cartProducts.flatMap(p => p.sizes || []),
            material: cartProducts.map(p => p.material).filter(Boolean).join(' '),
            gender: cartGenders.join(' ')
        });

        // Get recommendations based on gender preference
        let candidateProducts = allProducts.filter(p => 
            !cartProductIds.includes(p._id.toString()) && // Exclude all cart items
            p.isPublished && 
            p.isAvailable
        );

        // Apply gender filtering based on cart contents
        console.log('Cart genders:', cartGenders);
        console.log('Cart products:', cartProducts.map(p => ({ name: p.name, gender: p.gender })));
        
        if (cartGenders.length === 1) {
            // Single gender in cart - only show that gender
            candidateProducts = candidateProducts.filter(p => p.gender === cartGenders[0]);
            console.log(`Filtering to only ${cartGenders[0]} products. Found ${candidateProducts.length} candidates`);
        } else if (cartGenders.length > 1) {
            // Multiple genders in cart - show both genders
            candidateProducts = candidateProducts.filter(p => cartGenders.includes(p.gender));
            console.log(`Filtering to ${cartGenders.join(' and ')} products. Found ${candidateProducts.length} candidates`);
        }
        // If no gender specified, show all products

        // Compute similarity scores
        const similarities = candidateProducts
            .map(p => ({
                product: p,
                score: cosineSim(combinedCartVec, tfidfVectorize(p))
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, NUM_RECOMMENDATIONS)
            .map(item => item.product);

        res.json(similarities);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
 
    module.exports = router;