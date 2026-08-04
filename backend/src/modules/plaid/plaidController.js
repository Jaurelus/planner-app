import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import dotenv from "dotenv";
import User from "../user/userModel.js";
import Language from "twilio/lib/twiml/VoiceResponse.js";
import { link } from "node:fs";
dotenv.config();

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SS,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (req, res) => {
  const userid = req.userID;
  const user = await User.findOne({ _id: userid });
  const request = {
    user: {
      client_user_id: userid,
      phone_number: "415-555-0010", //Change to this for production : user.phoneNumber.padStart(12, "+1"),
    },
    client_name: "DayFlow",
    language: "en",
    country_codes: ["US"],
    products: ["transactions", "auth"],
    redirect_uri: "https://localhost:3000/plaid-redirect",
  };
  try {
    const response = await plaidClient.linkTokenCreate(request);
    const linkToken = response.data.link_token;

    if (response.status == 200) {
      return res
        .status(201)
        .json({ message: "Token created ", token: linkToken });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error, " + error });
  }
};

export const exchangeToken = async (req, res) => {
  const { linktoken } = req.headers;
  const request = {
    public_token: linktoken,
  };
  try {
    const response = await plaidClient.itemPublicTokenExchange(request);
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    return res
      .status(200)
      .json({ message: "Success", accessToken: accessToken, itemID: itemId });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getTransactions = async (req, res) => {
  console.log(req);

  try {
    const { accessToken } = req.body;

    // Provide a cursor from your database if you've previously
    // received one for the Item. Leave null if this is your
    // first sync call for this Item. The first request will
    // return a cursor.
    //let cursor = database.getLatestCursorOrNull(itemID);
    let cursor = null;

    // New transaction updates since "cursor"
    let added = [];
    let modified = [];
    // Removed transaction ids
    let removed = [];
    let hasMore = true;

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor: cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;

      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;

      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }

    // Persist cursor and updated data
    //database.applyUpdates(itemId, added, modified, removed, cursor);

    return res
      .status(200)
      .json({ message: "Success", transactions: added, modified, removed });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

export const getRecurringTransactions = async (req, res) => {
  const { accesstoken } = req.headers;
  const request = {
    access_token: accesstoken,
  };
  try {
    const response = await plaidClient.transactionsRecurringGet(request);
    let inflowStreams = response.data.inflow_streams;
    let outflowStreams = response.data.outflow_streams;
    return res.status(200).json({
      message: "Success getting recurring transactions",
      income: inflowStreams,
      expenses: outflowStreams,
    });
  } catch (err) {
    // handle error
    return res.status(400).json({ message: "Error " + err });
  }
};
