# Cryptocurrency Information Backend

This is a Node.js backend application that retrieves and updates cryptocurrency data using CoinGecko API and AirTable.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Background Jobs](#background-jobs)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This application provides a backend system for retrieving and updating cryptocurrency data. It utilizes CoinGecko API to fetch coin details and prices, and stores the data in AirTable. The application includes functionalities such as rate limiting, cache management, and background jobs for data updates.

## Getting Started
## VIDEO-[LINK_TO_DEMO_VIDEO](https://www.loom.com/share/546019b2880643a7a5cb4db8f1744b47?sid=bafd9a05-69e4-407d-abb7-d1f61164efb6)
### Prerequisites

- Node.js and npm: Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

   bash
   git clone [(https://github.com/Shanaya17/MotorQ)](https://github.com/Shanaya17/MotorQ.git)
  
   

2. Install dependencies:

   bash
   npm install
   

3. Set up AirTable:
   - Create an AirTable account if you don't have one.
   - Create a table to store cryptocurrency information, including coin details and prices.
   - Note down your AirTable API key and base ID.

4. Update environment variables:
   - Create a `.env` file in the project root directory.
   - Add the following variables and replace the placeholders with your actual values:

     
     ->AIRTABLE_API_KEY=pat76wu4swkHUpL5L.18ab2d881e18f0d1dfdc85c1d59feb3a23dd900f9617be9d94b7d61dc9b7a622
     
     ->AIRTABLE_BASE_ID=appkpR0bdPcoJMvq9
     

## Usage

1. Start the application:

   bash
   node app.js
   

2. Access the API endpoints in your browser or a tool like Postman:
   - To get the price of a specific coin: `https://api.coingecko.com/api/v3/simple/price`
   - To get the market details: `https://api.coingecko.com/api/v3/coins/markets`

3. Background jobs will periodically update cache, coin details, and market details as per the specified intervals.

## API Endpoints

- `GET /coins/price/:coinId`: Retrieve the current price of a specific coin.
- `GET /coins/market`: Retrieve market details of top 20 coins.

## Background Jobs

- Coin Details Update: Updates coin details every 10 minutes.
- Current Coin Price Update: Updates current coin prices every 1 minute.
- Market Details Update: Updates market details every 10 minutes.

## Testing

- Unit Testing: Use testing frameworks like Mocha, Jest, or Chai to write and execute unit tests for your components.
- Integration Testing: Test interactions between different components.
- API Testing: Use tools like Postman for API testing.
## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests. Please make sure to follow the contribution guidelines.

```
