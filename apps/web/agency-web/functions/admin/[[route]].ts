import { handle } from 'hono/cloudflare-pages';
import { createSonicJSApp } from '@sonicjs-cms/core';
import { workCollection } from '../../src/sonic/collections/work';
import { storeCollection } from '../../src/sonic/collections/store';
import { postsCollection } from '../../src/sonic/collections/posts';

const config = {
  basePath: '/admin',
  collections: {
    // Passing definitions directly to avoid file system scanning issues in serverless
    definitions: [workCollection, storeCollection, postsCollection]
  }
};

const app = createSonicJSApp(config);

export const onRequest = handle(app);
