import type { SonicJSConfig } from '@sonicjs-cms/core';
import posts from '../collections/posts.collection';
import work from '../collections/work.collection';
import store from '../collections/store.collection';
import pages from '../collections/pages.collection';
import services from '../collections/services.collection';
import courses from '../collections/courses.collection';

export const sonicConfig: SonicJSConfig = {
    collections: [
        posts,
        work,
        store,
        pages,
        services,
        courses
    ] as any
};
