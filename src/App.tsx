import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_STORE_DATA } from './data/defaultStore';
import {
  clearAllMediaFiles,
  deleteMediaFile,
  loadAllMediaUrls,
  loadCartItems,
  loadStoreData,
  saveCartItems,
  saveMediaFile,
  saveStoreData,
} from './lib/mediaStorage';
import {
  AboutConfig,
  CartItem,
  FilterCategory,
  HeroConfig,
  InfoModalTopic,
  LookbookItem,
  Product,
  SizeOption,
  StoreData,
} from './types/store';
import { Navbar } from './components/Navbar';
import { AdminToolbar } from './components/AdminToolbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { LookbookSection } from './components/LookbookSection';
import { AboutSection } from './components/AboutSection';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import {
  AboutEditorModal,
  HeroEditorModal,
  LookbookEditorModal,
  ProductEditorModal,
} from './components/AdminModals';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';

export function App() {
  const [storeData, setStoreData] = useState<StoreData>(() => loadStoreData());
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartItems());
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Customer modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [infoTopic, setInfoTopic] = useState<InfoModalTopic>(null);

  // Admin modals
  const [productEditorState, setProductEditorState] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [heroEditorOpen, setHeroEditorOpen] = useState(false);
  const [aboutEditorOpen, setAboutEditorOpen] = useState(false);
  const [editingLookbookItem, setEditingLookbookItem] = useState<LookbookItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  }, []);

  // Hydrate uploaded images from IndexedDB on initial mount
  useEffect(() => {
    const allIds: (string | null)[] = [
      storeData.hero.imageId,
      storeData.about.imageId,
      ...storeData.products.map((p) => p.imageId),
      ...storeData.lookbook.map((l) => l.imageId),
    ];

    loadAllMediaUrls(allIds).then((loaded) => {
      setMediaUrls((prev) => ({ ...prev, ...loaded }));
    });
    // Only run initial hydration once on mount; incremental uploads update mediaUrls directly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist structured store data and cart to localStorage
  useEffect(() => {
    saveStoreData(storeData);
  }, [storeData]);

  useEffect(() => {
    saveCartItems(cartItems);
  }, [cartItems]);

  // Helper to upload an image and update mediaUrls cache
  const uploadAndStoreImage = useCallback(
    async (file: File, previousId?: string | null): Promise<string> => {
      const { mediaId, url } = await saveMediaFile(file, previousId);
      setMediaUrls((prev) => {
        const next = { ...prev, [mediaId]: url };
        if (previousId) delete next[previousId];
        return next;
      });
      return mediaId;
    },
    []
  );

  const removeStoredImage = useCallback(async (mediaId: string | null) => {
    if (!mediaId) return;
    await deleteMediaFile(mediaId);
    setMediaUrls((prev) => {
      const next = { ...prev };
      delete next[mediaId];
      return next;
    });
  }, []);

  /* ----------------------------- Hero Handlers ---------------------------- */
  const handleUploadHeroImage = async (file: File) => {
    const newId = await uploadAndStoreImage(file, storeData.hero.imageId);
    setStoreData((prev) => ({
      ...prev,
      hero: { ...prev.hero, imageId: newId },
    }));
    showToast('Hero banner updated');
  };

  const handleRemoveHeroImage = async () => {
    await removeStoredImage(storeData.hero.imageId);
    setStoreData((prev) => ({
      ...prev,
      hero: { ...prev.hero, imageId: null },
    }));
    showToast('Hero banner image removed');
  };

  const handleSaveHeroCopy = (updated: Partial<HeroConfig>) => {
    setStoreData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updated },
    }));
    showToast('Hero editorial copy saved');
  };

  /* --------------------------- Product Handlers --------------------------- */
  const handleUploadProductImage = async (productId: string, file: File) => {
    const target = storeData.products.find((p) => p.id === productId);
    const newId = await uploadAndStoreImage(file, target?.imageId);
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, imageId: newId } : p
      ),
    }));
    showToast('Product photography uploaded');
  };

  const handleRemoveProductImage = async (productId: string) => {
    const target = storeData.products.find((p) => p.id === productId);
    if (target?.imageId) {
      await removeStoredImage(target.imageId);
    }
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, imageId: null } : p
      ),
    }));
    showToast('Product photo removed');
  };

  const handleSaveProduct = async (
    draft: Omit<Product, 'id' | 'imageId'>,
    existingId: string | null,
    pendingFile: File | null,
    removeExistingImage: boolean
  ) => {
    if (existingId) {
      const existing = storeData.products.find((p) => p.id === existingId);
      let nextImageId = existing?.imageId ?? null;

      if (pendingFile) {
        nextImageId = await uploadAndStoreImage(pendingFile, existing?.imageId);
      } else if (removeExistingImage && existing?.imageId) {
        await removeStoredImage(existing.imageId);
        nextImageId = null;
      }

      setStoreData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === existingId ? { ...p, ...draft, imageId: nextImageId } : p
        ),
      }));
      showToast(`Saved "${draft.title}"`);
    } else {
      let newImageId: string | null = null;
      if (pendingFile) {
        newImageId = await uploadAndStoreImage(pendingFile, null);
      }
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...draft,
        imageId: newImageId,
      };
      setStoreData((prev) => ({
        ...prev,
        products: [newProduct, ...prev.products],
      }));
      showToast(`Published "${draft.title}"`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const target = storeData.products.find((p) => p.id === productId);
    if (target?.imageId) {
      await removeStoredImage(target.imageId);
    }
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Product removed from catalog');
  };

  /* --------------------------- Lookbook Handlers -------------------------- */
  const handleUploadLookbookImage = async (itemId: string, file: File) => {
    const target = storeData.lookbook.find((l) => l.id === itemId);
    const newId = await uploadAndStoreImage(file, target?.imageId);
    setStoreData((prev) => ({
      ...prev,
      lookbook: prev.lookbook.map((l) =>
        l.id === itemId ? { ...l, imageId: newId } : l
      ),
    }));
    showToast('Lookbook photo uploaded');
  };

  const handleRemoveLookbookImage = async (itemId: string) => {
    const target = storeData.lookbook.find((l) => l.id === itemId);
    if (target?.imageId) {
      await removeStoredImage(target.imageId);
    }
    setStoreData((prev) => ({
      ...prev,
      lookbook: prev.lookbook.map((l) =>
        l.id === itemId ? { ...l, imageId: null } : l
      ),
    }));
    showToast('Lookbook photo removed');
  };

  const handleSaveLookbookItem = async (
    updatedItem: LookbookItem,
    pendingFile: File | null
  ) => {
    let nextImageId = updatedItem.imageId;
    if (pendingFile) {
      nextImageId = await uploadAndStoreImage(pendingFile, updatedItem.imageId);
    }
    setStoreData((prev) => ({
      ...prev,
      lookbook: prev.lookbook.map((l) =>
        l.id === updatedItem.id ? { ...updatedItem, imageId: nextImageId } : l
      ),
    }));
    showToast('Lookbook frame updated');
  };

  const handleAddLookbookItem = () => {
    const nextNumber = String(storeData.lookbook.length + 1).padStart(2, '0');
    const newItem: LookbookItem = {
      id: `look-${Date.now()}`,
      lookNumber: `Look ${nextNumber}`,
      title: 'New Campaign Frame',
      caption: 'Upload editorial styling notes and campaign imagery.',
      aspect: storeData.lookbook.length % 2 === 0 ? 'portrait' : 'landscape',
      imageId: null,
    };
    setStoreData((prev) => ({
      ...prev,
      lookbook: [...prev.lookbook, newItem],
    }));
    setEditingLookbookItem(newItem);
  };

  const handleDeleteLookbookItem = async (itemId: string) => {
    const target = storeData.lookbook.find((l) => l.id === itemId);
    if (target?.imageId) {
      await removeStoredImage(target.imageId);
    }
    setStoreData((prev) => ({
      ...prev,
      lookbook: prev.lookbook.filter((l) => l.id !== itemId),
    }));
    showToast('Lookbook frame removed');
  };

  /* ---------------------------- About Handlers ---------------------------- */
  const handleUploadAboutImage = async (file: File) => {
    const newId = await uploadAndStoreImage(file, storeData.about.imageId);
    setStoreData((prev) => ({
      ...prev,
      about: { ...prev.about, imageId: newId },
    }));
    showToast('Atelier portrait uploaded');
  };

  const handleRemoveAboutImage = async () => {
    await removeStoredImage(storeData.about.imageId);
    setStoreData((prev) => ({
      ...prev,
      about: { ...prev.about, imageId: null },
    }));
    showToast('Atelier portrait removed');
  };

  const handleSaveAboutStory = (updated: Partial<AboutConfig>) => {
    setStoreData((prev) => ({
      ...prev,
      about: { ...prev.about, ...updated },
    }));
    showToast('Brand story saved');
  };

  /* ----------------------------- Cart Handlers ---------------------------- */
  const handleAddToBag = (product: Product, size: SizeOption) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, size, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, size: SizeOption, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, size: SizeOption) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const handleClearBag = () => {
    setCartItems([]);
  };

  /* ----------------------------- Reset Store ------------------------------ */
  const handleResetStore = async () => {
    await clearAllMediaFiles();
    setMediaUrls({});
    setStoreData(DEFAULT_STORE_DATA);
    setCartItems([]);
    showToast('Store reset to clean defaults');
  };

  /* ---------------------------- Derived Counts ---------------------------- */
  const bagCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const { uploadedCount, totalSlots } = useMemo(() => {
    const slots = [
      storeData.hero.imageId,
      storeData.about.imageId,
      ...storeData.products.map((p) => p.imageId),
      ...storeData.lookbook.map((l) => l.imageId),
    ];
    return {
      totalSlots: slots.length,
      uploadedCount: slots.filter((id) => Boolean(id && mediaUrls[id])).length,
    };
  }, [storeData, mediaUrls]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      <Navbar
        bagCount={bagCount}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode((prev) => !prev)}
        onOpenBag={() => setIsBagOpen(true)}
      />

      {isAdminMode && (
        <AdminToolbar
          uploadedCount={uploadedCount}
          totalSlots={totalSlots}
          onAddNewProduct={() => setProductEditorState({ open: true, product: null })}
          onEditHeroCopy={() => setHeroEditorOpen(true)}
          onEditAboutStory={() => setAboutEditorOpen(true)}
          onResetStore={handleResetStore}
        />
      )}

      <main>
        <HeroSection
          hero={storeData.hero}
          heroImageUrl={storeData.hero.imageId ? mediaUrls[storeData.hero.imageId] : undefined}
          isAdminMode={isAdminMode}
          onUploadHeroImage={handleUploadHeroImage}
          onRemoveHeroImage={handleRemoveHeroImage}
          onOpenHeroEditor={() => setHeroEditorOpen(true)}
        />

        <CatalogSection
          products={storeData.products}
          mediaUrls={mediaUrls}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          isAdminMode={isAdminMode}
          onQuickViewProduct={(product) => setQuickViewProduct(product)}
          onEditProduct={(product) => setProductEditorState({ open: true, product })}
          onAddNewProduct={() => setProductEditorState({ open: true, product: null })}
          onUploadProductImage={handleUploadProductImage}
          onRemoveProductImage={handleRemoveProductImage}
          onAddToBag={handleAddToBag}
        />

        <LookbookSection
          items={storeData.lookbook}
          mediaUrls={mediaUrls}
          isAdminMode={isAdminMode}
          onUploadLookbookImage={handleUploadLookbookImage}
          onRemoveLookbookImage={handleRemoveLookbookImage}
          onEditLookbookItem={(item) => setEditingLookbookItem(item)}
          onAddLookbookItem={handleAddLookbookItem}
        />

        <AboutSection
          about={storeData.about}
          aboutImageUrl={storeData.about.imageId ? mediaUrls[storeData.about.imageId] : undefined}
          isAdminMode={isAdminMode}
          onUploadAboutImage={handleUploadAboutImage}
          onRemoveAboutImage={handleRemoveAboutImage}
          onOpenAboutEditor={() => setAboutEditorOpen(true)}
        />
      </main>

      <Footer onOpenInfoModal={(topic) => setInfoTopic(topic)} />

      {/* Customer Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        imageUrl={
          quickViewProduct?.imageId ? mediaUrls[quickViewProduct.imageId] : undefined
        }
        onClose={() => setQuickViewProduct(null)}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        isOpen={isBagOpen}
        items={cartItems}
        products={storeData.products}
        mediaUrls={mediaUrls}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearBag={handleClearBag}
      />

      <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />

      {/* Admin Editor Modals */}
      <ProductEditorModal
        isOpen={productEditorState.open}
        product={productEditorState.product}
        mediaUrls={mediaUrls}
        onClose={() => setProductEditorState({ open: false, product: null })}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />

      <HeroEditorModal
        isOpen={heroEditorOpen}
        hero={storeData.hero}
        onClose={() => setHeroEditorOpen(false)}
        onSave={handleSaveHeroCopy}
      />

      <LookbookEditorModal
        isOpen={Boolean(editingLookbookItem)}
        item={editingLookbookItem}
        onClose={() => setEditingLookbookItem(null)}
        onSave={handleSaveLookbookItem}
        onDelete={handleDeleteLookbookItem}
      />

      <AboutEditorModal
        isOpen={aboutEditorOpen}
        about={storeData.about}
        onClose={() => setAboutEditorOpen(false)}
        onSave={handleSaveAboutStory}
      />

      {/* Quiet Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 border border-[#D8CFC4] bg-[#1A1A1A] px-5 py-3 text-xs font-medium tracking-wide text-[#FAF9F6] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
