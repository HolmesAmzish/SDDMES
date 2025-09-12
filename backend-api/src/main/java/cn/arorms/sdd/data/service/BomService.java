package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.Bom;
import cn.arorms.sdd.data.repository.BomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BomService {
    private BomRepository bomRepository;
    public BomService(BomRepository bomRepository) {
        this.bomRepository = bomRepository;
    }

    public List<Bom> getAllBoms() {
        return bomRepository.findAllWithProductItem();
    }

    public Optional<Bom> getBomById(Long id) {
        return bomRepository.findByIdWithProductItem(id);
    }

    @Transactional
    public Bom add(Bom bom) {
        if (bom.getBomLines() != null) {
            bom.getBomLines().forEach(line -> line.setBomHeader(bom));
        }
        return bomRepository.save(bom);
    }

    @Transactional
    public Bom update(Long id, Bom bomDetails) {
        return bomRepository.findById(id).map(bom -> {
            bom.setProductItem(bomDetails.getProductItem());
            bom.setQuantity(bomDetails.getQuantity());

            bom.getBomLines().clear();
            if (bomDetails.getBomLines() != null) {
                bomDetails.getBomLines().forEach(line -> {
                    line.setBomHeader(bom);
                    bom.getBomLines().add(line);
                });
            }
            return bomRepository.save(bom);
        }).orElseThrow(() -> new RuntimeException("Bom not found with id " + id));
    }

    @Transactional
    public void deleteBom(Long id) {
        bomRepository.deleteById(id);
    }
}
