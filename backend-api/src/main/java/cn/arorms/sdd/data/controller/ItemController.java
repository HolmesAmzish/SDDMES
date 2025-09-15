package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.Item;
import cn.arorms.sdd.data.service.ItemService;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController {
    private ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @RequestMapping("/get")
    public List<Item> getAllItems() {
        return itemService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addItem(@RequestBody Item item) {
        itemService.add(item);
        return ResponseEntity.ok("Item added successfully");

    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteItem(@RequestParam Long id) {
        itemService.delete(id);
        return ResponseEntity.ok("Item deleted successfully");
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateItem(@RequestBody Item item) {
        itemService.update(item);
        return ResponseEntity.ok("Item updated successfully");
    }
}
