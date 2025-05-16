echo "Building client app..."
cd client
npm install
npm run build

cd ..

echo "Installing server dependencies..."
cd server
npm install

# echo "Starting Express server in production..."
# node index.js