import balance from '@data/balance.json';
import customers from '@data/customers.json';
import instructionOptions from '@data/instruction-options.json';
import products from '@data/products.json';
import staff from '@data/staff.json';
import storeLayout from '@data/store-layout.json';
import { loadConfig,type RawConfig } from './loadConfig';
export const defaultRawConfig:RawConfig={balance,customers,instructionOptions,products,staff,storeLayout};
export const loadDefaultConfig=()=>loadConfig(defaultRawConfig);
