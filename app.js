const FRUITS = ["apple", "grape", "orange", "pear", "pineapple", "strawberry"];
document.getElementById("root").append(generateVendingMachineDom(FRUITS, 270, 300, "red", "yellow"));

function generateVendingMachineDom (items, minPrice, maxPrice, mainColor, subColor) {
	const products = createObjectList(items, minPrice, maxPrice);
	const container = createDomWithStyle("div", ["w-1/2", "flex", "flex-col", `bg-${mainColor}-400`]);
	const header = createDomWithStyle("div", ["w-full", "py-3", "tracking-wider", "font-bold", "text-center", "text-xl", "uppercase", "text-grey-700"]);

	const SIZE_OF_SLIDE_IMAGE = 40;
	const slider = generateSliderDom(); // スライドショー
	const display = generateDisplayDom(); // 商品詳細表示画面
	const controller = generateControllerDom(); // 選択ボタン

	header.innerHTML = "Vending Machine";
	container.append(header, slider, display, controller);
	return container;

	// 商品名の配列を受け取り、商品オブジェクトの配列を返す関数。priceの値は、minPriceとmaxPriceの間の10の倍数がランダムに割り当てられる。
	// 戻り値の例: [{id: "1" name: "apple", price: 270, imgDom: <img>~</img>>}, {...}, {...}]
	function createObjectList (items, minPrice, maxPrice) {
		const objects = [];
		for (let i = 0; i < items.length; i++) {
			const id = i+1;
			const slideImg = createDomWithStyle("img", ["w-40"]);
			slideImg.src = `assets/${items[i]}.jpg`;
			objects.push({ id: id, name: items[i], price: `${getMultipleOfTen()} yen`, imgDom: slideImg });
		}
		return objects;
    
    // minPriceとmaxPriceの間の10の倍数をランダムに返す関数
		function getMultipleOfTen () {
			return Math.floor(((Math.random() * (maxPrice + 1 - minPrice)) + minPrice) / 10) * 10;
		}
	}

	// スライドショー部分のDOMを返す関数。
  // 戻り値 div
	function generateSliderDom () {
		const container = createDomWithStyle("div", ["py-5", "flex", "justify-center", "items-center", `bg-${subColor}-400`]);
		const screen = createDomWithStyle("div", [`w-${SIZE_OF_SLIDE_IMAGE}`, "overflow-hidden", "bg-indigo-300"]);
		const slideImgBox = createDomWithStyle("div", ["transform", "flex", "transition", "ease-in-out"]);

		// クリックされたボタンのidに応じてslideImgBoxのtranslateX(-x)の値を変化させる。
		slideImgBox.style.transitionDuration = "1s";
		slideImgBox.id = "targetDomForTransform";

		for (const product of products) slideImgBox.append(product.imgDom);
		screen.append(slideImgBox);
		container.append(screen);
		return container;
	}

  // 商品詳細表示画面のDOMを返す関数。
  // 戻り値 div
	function generateDisplayDom () {
		const container = createDomWithStyle("div", ["p-3", "flex", "justify-center", "items-center", `bg-${mainColor}-400`]);
		const selectedProductIndex = createDomWithStyle("p", ["w-1/3", "flex", "justify-center", "items-center", "px-5", "py-3", "font-bold", `bg-${subColor}-400`]);
		const selectedProductName = selectedProductIndex.cloneNode(true);
		const selectedProductPrice = selectedProductIndex.cloneNode(true);

		// 初期状態
		selectedProductIndex.id = "targetIndexRewrite";
		selectedProductIndex.innerHTML = products[0].id;
		selectedProductName.id = "targetNameRewrite";
		selectedProductName.innerHTML = `${products[0].name.toUpperCase()} Juice`;
		selectedProductPrice.id = "targetPriceRewrite";
		selectedProductPrice.innerHTML = products[0].price;

		container.append(selectedProductIndex, selectedProductName, selectedProductPrice);
		return container;
	}

  // 選択ボタン部分のDOMを返す関数。
  // 戻り値 div
	function generateControllerDom () {
		const container = createDomWithStyle("div", ["flex", "flex-col"]);
		const subContainer = createDomWithStyle("div", ["p-5", "flex", "justify-center", "items-center"]);
		const purchaseBtn = createDomWithStyle("button", ["px-7", "py-5", "font-bold", "text-lg", "tracking-wider", `bg-${subColor}-400`]);

		// 購入ボタン
		purchaseBtn.innerHTML = "BUY";
		purchaseBtn.addEventListener("click", function () {
			const purchaseItem = products[document.getElementById("targetIndexRewrite").innerHTML - 1];
			alert(`Thank you for your purchase! This is ${purchaseItem.name} Juice (${purchaseItem.price})`);
		});

		// 選択ボタン
		for (let i = 0; i < products.length; i++) {
			const btn = createDomWithStyle("button", ["button", "m-4", "px-5", "py-3", "font-bold", "text-sm", `bg-${subColor}-400`]);
			btn.id = i;
			btn.innerHTML = i+1;
      // スライドショーの更新処理
			btn.addEventListener("click", function () {
				const target = document.getElementById("targetDomForTransform");

        // Tailwind CSSの w-40 は width: 10rem にあたる
				target.style.transform = `translateX(-${(SIZE_OF_SLIDE_IMAGE * btn.id) / 4}rem)`;

				// 商品詳細表示画面の更新処理
				const nextProduct = products[btn.id];
				document.getElementById("targetIndexRewrite").innerHTML = nextProduct.id;
				document.getElementById("targetNameRewrite").innerHTML = `${nextProduct.name.toUpperCase()} Juice`;
				document.getElementById("targetPriceRewrite").innerHTML = nextProduct.price;
			});
      subContainer.append(btn);
		}
		container.append(subContainer, purchaseBtn);
		return container;
	}
}
function createDomWithStyle (tag, styles) {
	const dom = document.createElement(tag);
	styles.forEach(s => dom.classList.add(s));
	return dom;
}
