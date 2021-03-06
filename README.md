## Basic Overview
This t-shop shows a simple ecommerce application based on `React/Redux` where the clients can buy different t-shirts. 
Clients can filter sizes, order by price and buy as many t-shirts as they want.

## Build/Run
#### Requirements
- Node.js version 10 (lts/dubnium)
- Docker

```bash
##### With Docker

# Build the image and fire up the container
docker-compose up -d --build

# Bring down the container before moving on
docker-compose stop


##### Without Docker (locally)

# First, Install the needed packages
npm install

# Then start both Node and React
npm start
```

Using docker the application will be available under `http://localhost:3001`. Otherwise, it will be under port `3000`.


<sub>Special thanks to <a href="http://www.jeffersonribeiro.com/">Jefferson Ribeiro</a> and all contributors for this amazing <a href="https://github.com/damonpam/react-shopping-cart/tree/staging">shopping cart.</a></sub>

## Tests
#### Execution
testdocker simply passes a variable that specifies the different port, as configured in the script in package.json
##### With Docker
```
npm run testdocker
```
##### Without Docker (locally)
```
npm test
```
#### Tools
- Cucumber js
- Puppeteer
- Chai
- Cucumber html reporter

#### Overview
- Feature files can be found under tests/features
- Step definitions can be found in tests/features/step_defitions
- Html report gets generated to root (cucumber-html-result.html)
