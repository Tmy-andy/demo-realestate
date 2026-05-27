-- Sửa key_code thiếu prefix 'ui.' do seed lần trước.
-- Idempotent: chỉ update những key chưa có prefix 'ui.'.

UPDATE translation_keys
   SET key_code = CONCAT('ui.', key_code)
 WHERE namespace_code = 'ui'
   AND key_code IN (
     'group.tongQuan','group.phanKhu','group.tienIchNoiKhu','group.tienIchNgoaiKhu',
     'group.matBangTang','group.view360',
     'pc.overviewFull','pc.filteringBy','pc.highlightInfo','pc.watchIntroVideo',
     'pc.subdivision','pc.overviewInfo','pc.highlightPoints','pc.viewProductsInPk',
     'pc.exploreVrTour','pc.status.opening',
     'status.available','status.holding','status.sold',
     'gallery.emptyVideo','gallery.emptyPhoto',
     'empty.content','empty.location','empty.milestone',
     'timeline.done','timeline.doing','timeline.upcoming',
     'res.brochure','res.brandKit','res.priceList','res.floorPlanPdf',
     'props.empty','props.filter.type','props.filter.maxPrice',
     'props.detail.consultant','props.detail.price','props.detail.status',
     'props.detail.type','props.detail.legal','props.detail.handover',
     'props.emptyFloorplan',
     'mp.overviewEyebrow','mp.filter','mp.exploreVrTour',
     'mp.group.subdivision','mp.group.displayType','mp.group.property','mp.group.status',
     'mp.selectAll',
     'ai.title','ai.active','ai.listening','ai.thinking','ai.speaking',
     'ai.inputPh','ai.close','ai.errBrowser','ai.errMic',
     'ai.connecting','ai.disconnected','ai.alertTitle','ai.alertOk'
   );

-- Kiểm tra
SELECT key_code FROM translation_keys
 WHERE namespace_code='ui' AND key_code LIKE 'ui.group.%';
