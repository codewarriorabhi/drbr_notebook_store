import notebookClassic from "@/assets/notebook-classic.jpg";
import notebookSpiral from "@/assets/notebook-spiral.jpg";
import notebookJournal from "@/assets/notebook-journal.jpg";
import notebookEco from "@/assets/notebook-eco.jpg";

const categories = [
  { title: "Notebooks", desc: "Durable notebooks for students and professionals.", image: notebookClassic },
  { title: "Planners", desc: "Organize your days with premium planners.", image: notebookSpiral },
  { title: "Journals", desc: "Handcrafted journals for notes and reflections.", image: notebookJournal },
  { title: "Accessories", desc: "Pens, stickers and desk essentials to pair with notebooks.", image: notebookEco },
];

const CategoriesSection = () => (
  <section className="section-max-width px-5 my-7" id="categories">
    <h3 className="text-primary font-extrabold text-xl mb-4">Shop by Category</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map(cat => (
        <article
          key={cat.title}
          className="glass-surface rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[var(--shadow-card)]"
        >
          <div className="w-full h-40 bg-cover bg-center" style={{ backgroundImage: `url(${cat.image})` }} />
          <div className="p-3.5 flex flex-col gap-2">
            <h4 className="text-sm font-extrabold text-foreground">{cat.title}</h4>
            <p className="text-xs text-muted-foreground">{cat.desc}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default CategoriesSection;
