---
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Aynı modern API ile React'e hızlı ve 3kB'lık alternatif</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Başlangıç</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact'e Geçiş</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const [value, setValue] = useState(0);

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={() => setValue(value - 1)}>Decrement</button>
    </>
  )
}
```

<div class="sponsors">
  <p><a href="https://opencollective.com/preact">Sponsorluğunda:</a></p>
  <sponsors></sponsors>
</div>

<section class="home-top">
    <h2>Başka bir tür kütüphane</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Metal'e yakın</h3>
    <p>
        Preact, DOM'un üzerinde mümkün olabilecek en ince Sanal DOM soyutlamasını sağlar.
        Web stabil bir platform, emniyet adına sürekli yeniden icat etmeyi bırakmamızın zamanı geldi.
    </p>
    <p>
        Preact ayrıca web platformunun birinci sınıf bir vatandaşıdır.
        Sanal DOM'u, DOM'un kendisine karşı ayrıştırır, gerçek olay işleyicilerini kaydeder ve diğer kütüphanelerle düzgün çalışır.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" alt="boyut" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Küçük Boyutlu</h3>
    <p>
        Çoğu UI framework'ü, uygulamanın Javascript boyutunun çoğunluğunu oluşturacak kadar büyüktür.
        Preact ise farklı: <em>sizin kodunuz</em> uygulamanın çoğunluğunu oluşturacak kadar büyük kalır.
    </p>
    <p>
        Bu, indirilecek, ayrıştırılacak ve çalıştırılacak daha az Javascript manasına geliyor - sizin kodunuza daha fazla zaman bırakıyor, böylece framework'ü kontrol altında tutmak için dövüşmeden bir deneyim inşa edebilirsiniz.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" alt="performans" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Büyük Performans</h3>
    <p>
        Preact hızlıdır, fakat sadece boyutu yüzünden değil.
        Basit ve öngörülebilir fark algoritması sayesinde en hızlı Sanal DOM kütüphanelerine sahipdir.
    </p>
    <p>
        Özelleştirilebilir toplu güncelleme, isteğe bağlı asenkron render, DOM geri dönüşümü ve optimize edilmiş olay işleyicisi gibi ekstra performans özellikleri bile içeriyor.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" alt="taşınabilir" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Taşınabilir &amp; Gömülebilir</h3>
    <p>
        Preact'in küçük boyutlu kod tabanı, güçlü bir Sanal DOM Bileşeni paradigmasını alıp erişilmez denizlere yelken açabileceğiniz manasına gelir.
    </p>
    <p>
        Karmaşık entegrasyon adımları olmadan bir uygulamanın parçalarını geliştirmek için Preact kullanın.
        Preact'i bir widget'ın içine yerleştirin ve tam bir uygulama geliştirmek için kullandığınız araçları ve teknikleri uygulayın.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" alt="üretken" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Anlık Üretkenlik</h3>
    <p>
        Hafiflik, üretkenlikten feda ederek oraya ulaşmak zorunda kalmadığınızda daha çok eğlencelidir.
        Preact sizi anlık üretken yapar.
        Hatta birkaç bonus özellik de var:
    </p>
    <ul>
        <li>`props`, `state` ve `context` zaten `render()`'a paslanmış durumda. </li>
        <li>`class` ve `for` gibi standart HTML attribute'larını kullanabilirsiniz.</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" alt="uyumlu" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Ekosistem Uyumluluğu</h3>
    <p>
        Sanal DOM Component'leri, butonlardan data sağlayıcılarına kadar yeniden kullanılabilir şeyleri paylaşmayı kolaylaştırır.
        Preact'ın tasarımı, halihazırda React'ın ekosisteminde bulunan yüzlerce Component'i sorunsuz bir şekilde kullanabileceğiniz manasına gelir.
    </p>
    <p>
        Paketleyicinizde <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a>'ı eklemek, bir uyumluluk katmanı sunarak karmaşık React bileşenlerini dahi uygulamanızda kullanmanıza izin veriyor.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Örneğe gözatın!</h2>
</section>


<section class="home-split">
    <div>
        <h3>TodoList (yapılacaklar listesi) Component'i</h3>
        <pre><code class="language-jsx">
// --repl
export default class TodoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.currentTarget.value });
    };
    addTodo = () =&gt; {
        let { todos, text } = this.state;
        todos = todos.concat({ text });
        this.setState({ todos, text: '' });
    };
    render({ }, { todos, text }) {
        return (
            &lt;form onSubmit={this.addTodo} action="javascript:"&gt;
                &lt;label&gt;
                  &lt;span&gt;Add Todo&lt;/span&gt;
                  &lt;input value={text} onInput={this.setText} /&gt;
                &lt;/label&gt;
                &lt;button type="submit"&gt;Add&lt;/button&gt;
                &lt;ul&gt;
                    { todos.map( todo =&gt; (
                        &lt;li&gt;{todo.text}&lt;/li&gt;
                    )) }
                &lt;/ul&gt;
            &lt;/form&gt;
        );
    }
}
// --repl-after
render(&lt;TodoList /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>Çalışan Örnek</h3>
        <pre repl="false"><code class="language-jsx">
import TodoList from './todo-list';<br>
render(&lt;TodoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>


<section class="home-split">
    <div>
        <h3>Github Yıldız Sayısını Çekmek</h3>
        <pre><code class="language-jsx">
// --repl
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = `https://github.com/${repo}`;
        return (
            &lt;a href={url} class="stars"&gt;
                ⭐️ {stars} Yıldız
            &lt;/a&gt;
        );
    }
}
// --repl-after
render(&lt;Stars repo="preactjs/preact" /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>Çalışan Örnek</h3>
        <pre repl="false"><code class="language-jsx">
import Stars from './stars';<br>
render(
    &lt;Stars repo="developit/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple="true" user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>


<section class="home-top">
    <h2>Kolları sıvamaya hazır mısın?</h2>
</section>


<section style="text-align:center;">
    <p>
        React ile ilgili deneyime sahip olup olmadığınıza dayalı olarak farklı kılavuzlarımız var.
        <br>
        Size uygun olan kılavuzu seçin!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Başlangıç</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact'e Geçiş</a>
    </p>
</section>
