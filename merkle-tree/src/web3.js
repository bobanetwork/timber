/**
@module web3.js
@desc
@author liju jose
*/

import Web3 from 'web3';
import config from 'config';
import logger from './logger';

export default {
  connection() {
    return this.web3;
  },
  buildUrl() {
    if (config.web3.rpcUrl) return config.web3.rpcUrl;
    return `${config.web3.host}:${config.web3.port}`;
  },
  /**
   * Connects to web3 and then sets proper handlers for events
   */
  connect() {
    if (this.web3) return this.web3;

    logger.info('Blockchain Connecting ...');
    const provider = new Web3.providers.WebsocketProvider(
      this.buildUrl(),
      null,
      config.web3.options,
    );

    provider.on('error', err => {
      if (err.message.includes('CONNECTION ERROR:')) {
        logger.error('WebSocket connection error. Attempting to reconnect...');
        this.reconnect();
      } else {
        logger.error(err);
      }
    });
    provider.on('connect', () => logger.info('Blockchain Connected ...'));
    provider.on('end', () => logger.error('Blockchain Disconnected'));

    this.web3 = new Web3(provider);

    return this.web3;
  },

  reconnect() {
    this.connect();
  },

  /**
   * Checks the status of connection
   *
   * @return {Boolean} - Resolves to true or false
   */
  isConnected() {
    if (this.web3) {
      return this.web3.eth.net.isListening();
    }
    return false;
  },
};
