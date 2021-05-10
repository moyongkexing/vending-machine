const FRUITS = ["apple","grape","orange","pear","pineapple","strawberry"];
document.getElementById("root").append(generateVendingMachineDom(FRUITS,270,300,"red","yellow"));

function generateVendingMachineDom(items,minPrice,maxPrice,mainColor,subColor) {
  const products = createObjectList(items,minPrice,maxPrice) // 戻り値: [{id: ~, name: ~, price: ~, imgDom: ~}, {...}, {...}] 
  const container = createDomWithStyle("div",["w-1/2","flex","flex-col",`bg-${mainColor}-400`,]);
  const header = createDomWithStyle("div",["w-full","py-3","tracking-wider","font-bold","text-center","text-xl", "uppercase", "text-grey-700"])

  const sizeOfSlideImg = 40;
  const slider = generateSliderDom(products,subColor,sizeOfSlideImg); // スライドショー
  const display = generateDisplayDom(products,mainColor,subColor); // 商品詳細表示画面
  const controller = generateControllerDom(products,subColor,sizeOfSlideImg); // 選択ボタン

  header.innerHTML = "Vending Machine";
  container.append(header,slider,display,controller);
  return container;

  function createObjectList(items,minPrice,maxPrice) {
    let OBJECTS = [];
    for(let i = 0; i < items.length; i++) {
      let id = i + 1;
      const slideImg = createDomWithStyle("img", ["w-40"]);
      slideImg.src = `assets/${items[i]}.jpg`;
      OBJECTS.push({id: id, name: items[i], price: `${getMultipleOfNum(minPrice,maxPrice,10)} yen`, imgDom: slideImg});
    }
    return OBJECTS;

    function getMultipleOfNum(min,max,num){
      return Math.floor(((Math.random() * (max + 1 - min)) + min) / num) * num;
    }
  }

  function generateSliderDom(products,subColor,sizeOfSlideImg) {
    const container = createDomWithStyle("div",["py-5","flex","justify-center","items-center",`bg-${subColor}-400`,])
    const screen = createDomWithStyle("div",[`w-${sizeOfSlideImg}`,"overflow-hidden","bg-indigo-300"]);
    const slideImgBox = createDomWithStyle("div",["transform","flex","transition","ease-in-out"])

    // クリックされたボタンのidに応じてslideImgBoxのtranslateX(-x)の値を変化させることで、スライドアニメーションを実現する
    slideImgBox.style.transitionDuration = "1s"
    slideImgBox.id = "targetDomForTransform";

    container.append(screen);
    screen.append(slideImgBox)
    for(let product of products) slideImgBox.append(product.imgDom);
    return container;
  }

  function generateDisplayDom(products,mainColor,subColor) {
    const container = createDomWithStyle("div",["p-3","flex","justify-center","items-center",`bg-${mainColor}-400`]);
    const selectedProductIndex = createDomWithStyle("p",["w-1/3","flex","justify-center","items-center","px-5","py-3","font-bold",`bg-${subColor}-400`]);
    const selectedProductName = selectedProductIndex.cloneNode(true);
    const selectedProductPrice = selectedProductIndex.cloneNode(true);

    container.append(selectedProductIndex, selectedProductName,selectedProductPrice);

    // 初期状態
    selectedProductIndex.innerHTML = products[0].id 
    selectedProductName.innerHTML = `${products[0].name.toUpperCase()} Juice`;
    selectedProductPrice.innerHTML = products[0].price;
    
    selectedProductIndex.id = "targetIndexRewrite";
    selectedProductName.id = "targetNameRewrite";
    selectedProductPrice.id = "targetPriceRewrite";
    return container;
  }

  function generateControllerDom(products,subColor,sizeOfSlideImg) {
    const container = createDomWithStyle("div",["flex","flex-col"]);
    const subContainer = createDomWithStyle("div",["p-5","flex","justify-center","items-center"]);
    const purchaseBtn = createDomWithStyle("button",["px-7","py-5","font-bold","text-lg","tracking-wider",`bg-${subColor}-400`]);

    container.append(subContainer,purchaseBtn);

    // 購入ボタン
    purchaseBtn.innerHTML = "BUY";
    purchaseBtn.addEventListener("click",function(){
      const purchaseItem = products[document.getElementById("targetIndexRewrite").innerHTML - 1];
      alert(`Thank you for your purchase! This is ${purchaseItem.name} Juice (${purchaseItem.price})`);
    });

    // 選択ボタン
    for(let i = 0; i < products.length; i++) {
      const btn = createDomWithStyle("button",["button","m-4","px-5","py-3","font-bold","text-sm",`bg-${subColor}-400`]);
      subContainer.append(btn);
      btn.id = i
      btn.innerHTML = i + 1;
      btn.addEventListener("click", function(){
        // スライドショーの更新
        const target = document.getElementById("targetDomForTransform");
        
        // w-40(Tailwind css) = 10rem
        target.style.transform = `translateX(-${(sizeOfSlideImg * btn.id) / 4}rem)`;

        // 商品詳細表示画面の更新
        const nextProduct = products[btn.id];
        document.getElementById("targetIndexRewrite").innerHTML = nextProduct.id;
        document.getElementById("targetNameRewrite").innerHTML = `${nextProduct.name.toUpperCase()} Juice`;
        document.getElementById("targetPriceRewrite").innerHTML = nextProduct.price;
      })
    }
    return container;
  }

  function createDomWithStyle(tag,styles) {
    const dom = document.createElement(tag);
    styles.forEach(s => dom.classList.add(s));
    return dom;
  }
}
