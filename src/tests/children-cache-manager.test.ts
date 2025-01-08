import { CacheManager } from '../children-cache-manager.ts';

describe('CacheManager', () => {
    let cacheManager: CacheManager<any>;

    beforeEach(() => {
        cacheManager = new CacheManager<any>();
    });

    test('adding an item with a new type creates a new group', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
    });

    test('adding an item with the same type adds it to the same group', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type1');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
        expect(cacheManager.getItem('type1', 1)).toEqual({ name: 'item2' });
    });

    test('adding an item with a new key to the same group', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type1', 'customKey');
        expect(cacheManager.getItem('type1')).toEqual({ name: 'item1' });
        expect(cacheManager.getItem('type1', 'customKey')).toEqual({ name: 'item2' });
    });

    test('adding an item with the same key logs a warning', () => {
        console.warn = jest.fn(); // Mocking console.warn

        cacheManager.addItem({ name: 'item1' }, 'type1', 'customKey');
        cacheManager.addItem({ name: 'item2' }, 'type1', 'customKey');

        expect(console.warn).toHaveBeenCalledWith('Warning: The key "customKey" already exists in the group.');
    });

    test('adding an item with a changed type creates a new group', () => {
        cacheManager.addItem({ name: 'item1' }, 'type1');
        cacheManager.addItem({ name: 'item2' }, 'type2');
        expect(cacheManager.getItem('type2')).toEqual({ name: 'item2' });
    });

    test('returns undefined for a non-existent item or group', () => {
        expect(cacheManager.getItem('nonExistentType')).toBeUndefined();
        cacheManager.addItem({ name: 'item1' }, 'type1');
        expect(cacheManager.getItem('type1', 'nonExistentKey')).toBeUndefined();
    });

    test('can use a function as a group type', () => {
        const funcType = () => {};
        const funcType2 = () => {};

        cacheManager.addItem({ name: 'item1' }, funcType);
        cacheManager.addItem({ name: 'item2' }, funcType2);

        expect(cacheManager.getItem(funcType)).toEqual({ name: 'item1' });
        expect(cacheManager.getItem(funcType2)).toEqual({ name: 'item2' });
    });

    test('creates a new group for a changed function type', () => {
        const funcType = () => {};

        cacheManager.addItem({ name: 'item1' }, funcType);
        cacheManager.addItem({ name: 'item2' }, funcType);

        expect(cacheManager.getItem(funcType)).toEqual({ name: 'item1' });
    });
});
