package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.Item;
import cn.arorms.sdd.data.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for managing items in the inventory system.
 * @version 1.0 2025-09-11
 */
@Service
public class ItemService {
    private ItemRepository itemRepository;
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public void addItem(Item item) {
        itemRepository.save(item);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

}
