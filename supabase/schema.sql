-- Create custom types
CREATE TYPE product_status AS ENUM ('active', 'sold', 'draft');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  university TEXT NOT NULL,
  paystack_subaccount_id TEXT, -- Vendor's subaccount ID (10% commission goes to us, rest to this subaccount)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  status product_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products." ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products." ON products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products." ON products FOR DELETE USING (auth.uid() = seller_id);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  paystack_reference TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders (buyer or seller)." ON orders FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM products WHERE id = product_id)
);
CREATE POLICY "Buyers can create orders." ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Updates strictly controlled." ON orders FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM products WHERE id = product_id)
);
