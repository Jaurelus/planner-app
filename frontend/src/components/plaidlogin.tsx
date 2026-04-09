import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../Styles';
import Button from 'components/ui/button';

import * as SecureStore from 'expo-secure-store';
import {
  EmbeddedLinkView,
  LinkIOSPresentationStyle,
  LinkEvent,
  LinkExit,
  LinkSuccess,
} from 'react-native-plaid-link-sdk';
import { forEach } from 'eslint.config';

function PlaidLogin({ api }: { api: string }) {
  const [userToken, setUserToken] = useState<any>(null);
  const [linkToken, setLinkToken] = useState<any>(null);
  const [exchangeToken, setexchangeToken] = useState<any>(null);
  const [itemID, setItemID] = useState<any>(null);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [tStartDate, setTStartDate] = useState<any>(null);
  const [tEndDate, setTEndDate] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);

  useEffect(() => {
    if (transactions) {
      transactions.forEach((transaction) => {
        console.log('Transactions: ', transaction);
      });
    }
  }, [transactions]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token ? token : '');
      const user = await SecureStore.getItemAsync('userInfo');
      setUserInfo(user ? JSON.parse(user) : null);
    };
    fetchData();
    console.log('UserInfo, ', userInfo);
  }, []);
  //
  useEffect(() => {
    fetchLinkToken();
  }, [userInfo, userToken]);

  //--------API ----------
  const fetchLinkToken = async () => {
    if (!userInfo || !userToken) return;
    try {
      console.log(userToken, userInfo._id);
      const response = await fetch(api + 'plaid/createToken', {
        headers: {
          Authtoken: userToken,
          Userid: userInfo._id,
        },
        method: 'POST',
      });

      const data = await response.json();
      console.log('h');
      if (response.status == 201) {
        setLinkToken(data.token);
      } else {
        console.log(response.status, 'Server side error getting link token, ', data.message);
      }
    } catch (error) {
      console.log('Client side error getting link token', error);
    }
  };

  const exchangeLinkToken = async (publicToken: string) => {
    if (!publicToken) return;
    console.log('\n\n Exchanging\n\n');
    console.log(publicToken);
    try {
      const response = await fetch(api + 'plaid/exchangeToken', {
        headers: {
          Authtoken: userToken,
          Userid: userInfo._id,
          linktoken: publicToken,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const data = await response.json();
      console.log('Success exhanging token');
      if (response.status == 200) {
        console.log(data);
        setexchangeToken(data.accessToken);
        setItemID(data.itemID);
        console.log('Item ID: ', data.itemID);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log('Client error, ', error);
    }
  };

  const getTransactions = async () => {
    if (!exchangeToken) return;
    let today = new Date();
    const endDay = new Date(today.setMonth(today.getMonth() + 1));
    const payload: any = {
      accessToken: exchangeToken,
    };
    try {
      console.log('Trans try');

      //Change so it accepts user selected dates instead of preset backend dates
      const response = await fetch(api + 'plaid/getTransactions', {
        body: JSON.stringify(payload),
        headers: { Authtoken: userToken, userid: userInfo._id, 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Success getting transactions');
        setTransactions(data.transactions);
      } else {
        console.log('Server error, ', response.status, ' ', data.message);
      }
    } catch (error) {
      console.log('client error, ', error);
    }
  };

  const getRecurringTransactions = async () => {
    try {
      const response = await fetch(api + 'plaid/getRecurringTransactions', {
        headers: {
          accesstoken: exchangeToken,
          Authtoken: userToken,
          userid: userInfo._id,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      const data = await response.json();
      if (response.status == 200) {
        console.log('Recurring DataTransfer', data);
        console.log('IN', data.income);
        console.log('OUT', data.expenses);
      } else console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [exchangeToken]);

  return (
    <View>
      <Text>Plaid</Text>
      {linkToken && (
        <EmbeddedLinkView
          token={linkToken}
          onSuccess={(success: LinkSuccess) => {
            console.log(success.publicToken);
            exchangeLinkToken(success.publicToken);
          }}
          onEvent={(event: LinkEvent) => {}}
          iOSPresentationStyle={LinkIOSPresentationStyle.MODAL}
          onExit={(exit: LinkExit) => {
            console.log(exit);
          }}
          style={styles.embedded}></EmbeddedLinkView>
      )}
      <Button
        onPress={() => {
          getTransactions();
        }}>
        Test API
      </Button>
      <Button
        onPress={() => {
          getRecurringTransactions();
        }}>
        Test Recurring API
      </Button>
    </View>
  );
}

export default PlaidLogin;
