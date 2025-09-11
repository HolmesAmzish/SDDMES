package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.repository.ItemRepository;

/**
 * Service for managing items in the inventory system.
 * @version 1.0 2025-09-11
 */
public class ItemService {
    private ItemRepository itemRepository;
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

}
