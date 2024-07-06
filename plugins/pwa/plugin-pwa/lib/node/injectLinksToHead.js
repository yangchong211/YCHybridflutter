import { isPlainObject } from '@vuepress/helper';
export const injectLinksToHead = (options, base = '/', head = []) => {
    const metaKeys = [];
    const linkKeys = [];
    // Generate Hash for Head
    head.forEach((item) => {
        if (item[0] === 'meta')
            metaKeys.push(item[1].name);
        else if (item[0] === 'link')
            linkKeys.push(item[1].rel);
    });
    let fallBackIcon = '';
    const setLink = (rel, href, more = {}) => {
        if (!linkKeys.includes(rel))
            head.push(['link', { rel, href, ...more }]);
    };
    const setMeta = (name, content, more = {}) => {
        if (!metaKeys.includes(name))
            head.push(['meta', { name, content, ...more }]);
    };
    if (options.favicon)
        setLink('icon', options.favicon);
    if (options.manifest?.icons) {
        const { icons } = options.manifest;
        if (icons.length > 0) {
            fallBackIcon = icons[0].src;
            options.manifest.icons.forEach((icon) => {
                if (icon.type)
                    setLink('icon', icon.src, { type: icon.type, sizes: icon.sizes });
                else
                    setLink('icon', icon.src, { sizes: icon.sizes });
            });
        }
    }
    setLink('manifest', `${base}manifest.webmanifest`, {
        crossorigin: 'use-credentials',
    });
    setMeta('theme-color', options.themeColor || '#46bd87');
    if (isPlainObject(options.apple) && (options.apple.icon || fallBackIcon)) {
        setLink('apple-touch-icon', options.apple.icon || fallBackIcon);
        setMeta('apple-mobile-web-app-capable', 'yes');
        setMeta('apple-mobile-web-app-status-bar-style', options.apple.statusBarColor || 'black');
        if (options.apple.maskIcon)
            setLink('mask-icon', options.apple.maskIcon, {
                color: options.themeColor || '#46bd87',
            });
    }
    else if (options.apple !== false && fallBackIcon) {
        setLink('apple-touch-icon', fallBackIcon);
        setMeta('apple-mobile-web-app-capable', 'yes');
        setMeta('apple-mobile-web-app-status-bar-style', 'black');
    }
    if (isPlainObject(options.msTile) && (options.msTile.image || fallBackIcon)) {
        setMeta('msapplication-TileImage', options.msTile.image || fallBackIcon);
        setMeta('msapplication-TileColor', options.msTile.color || options.themeColor || '#46bd87');
    }
    else if (options.msTile !== false && fallBackIcon) {
        setMeta('msapplication-TileImage', fallBackIcon);
        setMeta('msapplication-TileColor', options.themeColor || '#46bd87');
    }
    return head;
};
