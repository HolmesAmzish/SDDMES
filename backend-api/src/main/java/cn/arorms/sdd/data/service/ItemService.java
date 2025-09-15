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

    public void add(Item item) {
        itemRepository.save(item);
    }

    public Item getById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        itemRepository.deleteById(id);
    }

    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    public void update(Item item) {
        itemRepository.save(item);
    }

}
