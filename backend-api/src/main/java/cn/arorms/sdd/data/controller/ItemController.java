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
        return itemService.getAllItems();
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addItem(@RequestBody Item item) {
        itemService.addItem(item);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/delete")
    public ResponseEntity<Long> deleteItem(@RequestParam Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok(id);
    }
}
