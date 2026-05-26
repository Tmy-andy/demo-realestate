# Huong dan vibe coding

File nay la ghi chu lam viec cho lap trinh vien khi phat trien du an.

## Nguyen tac bat buoc

- Tuyet doi khong them, sua, xoa bat ky file nao trong thu muc `vr-data/`.
- `vr-data/` la source xuat ra tu 3DVista, dung rieng cho VR 360.
- Khi can cap nhat noi dung VR 360, hay thay the toan bo source trong `vr-data/` bang ban export moi tu 3DVista.
- Khong viet logic du an, CSS tuy bien, component UI, hoac file cau hinh rieng vao `vr-data/`.

## Pham vi code cua du an

Tat ca phan code cua du an nam ben ngoai `vr-data/`, vi du:

- `index.html`: file entry chinh cua du an.
- `js/`: noi dat JavaScript tuy bien cua du an.
- Cac thu muc moi khac nhu `css/`, `assets/`, `components/` neu can mo rong sau nay.

## Tuong tac voi panorama

Khi can dieu khien panorama dang chay trong `vr-data/`, khong sua truc tiep source trong `vr-data/`.

Hay goi cac ham duoc expose trong `js/panorama.js`.

Vi du:

```html
<button type="button" data-pano-name="pano-01">Mo pano 01</button>
```

```js
var panoramaName = button.getAttribute('data-pano-name');
openPanoramaByName(panoramaName);
```

Trong do `openPanoramaByName(name)` la ham nam trong `js/panorama.js`, dung de mo panorama theo ten.

## Mau menu panorama

Neu can tao menu dieu huong panorama, nen khai bao ten panorama tren HTML bang `data-pano-name`, sau do bat su kien click va goi `openPanoramaByName(name)`.

```html
<nav class="panorama-menu" aria-label="Panorama menu">
    <button type="button" data-pano-name="pano-01">Pano 01</button>
    <button type="button" data-pano-name="pano-02">Pano 02</button>
    <button type="button" data-pano-name="pano-03">Pano 03</button>
</nav>
```

```js
document.querySelector('.panorama-menu').addEventListener('click', function(event) {
    var button = event.target.closest('[data-pano-name]');
    if (!button) {
        return;
    }

    var panoramaName = button.getAttribute('data-pano-name');
    openPanoramaByName(panoramaName);
});
```

## Quy trinh cap nhat VR 360

1. Export lai tour tu 3DVista.
2. Xoa hoac thay the toan bo noi dung cu trong `vr-data/`.
3. Dat source export moi vao `vr-data/`.
4. Giu nguyen cac file ben ngoai `vr-data/`, dac biet la `index.html` va `js/panorama.js`.
5. Kiem tra lai cac tuong tac goi ham trong `js/panorama.js`.

## Ghi chu cho lap trinh vien

- Neu can them UI, hay them vao `index.html` hoac file rieng ben ngoai `vr-data/`.
- Neu can them logic moi, hay dat trong `js/` va import tu `index.html`.
- Neu can them ham dieu khien panorama, uu tien mo rong `js/panorama.js`.
- Khong copy logic tuy bien vao file export cua 3DVista, vi se mat khi thay source `vr-data/`.
