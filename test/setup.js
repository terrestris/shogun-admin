import 'isomorphic-fetch';
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

global.URL.createObjectURL = jest.fn();
