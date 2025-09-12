package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.Bom;
import cn.arorms.sdd.data.service.BomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boms")
public class BomController {

    private final BomService bomService;

    public BomController(BomService bomService) {
        this.bomService = bomService;
    }

    @GetMapping
    public List<Bom> getAllBoms() {
        return bomService.getAllBoms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bom> getBomById(@PathVariable Long id) {
        return bomService.getBomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bom> addBom(@RequestBody Bom bom) {
        Bom savedBom = bomService.add(bom);
        return ResponseEntity.ok(savedBom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bom> updateBom(@PathVariable Long id, @RequestBody Bom bomDetails) {
        Bom updatedBom = bomService.update(id, bomDetails);
        return ResponseEntity.ok(updatedBom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBom(@PathVariable Long id) {
        bomService.deleteBom(id);
        return ResponseEntity.noContent().build();
    }
}
