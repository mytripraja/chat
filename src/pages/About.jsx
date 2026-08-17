import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About JAA FOODS - Our Story & Mission</title>
        <meta name="description" content="Learn about JAA FOODS - committed to creating refreshing and enjoyable food and beverage products." />
      </Helmet>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-orange/5 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-brand-dark">
              About <span className="text-gradient">JAA FOODS</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg">Our story, our mission</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white text-3xl font-bold font-heading mb-6">
                J
              </div>
              <h2 className="text-2xl font-bold font-heading text-brand-dark">Who We Are</h2>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg">
                JAA FOODS is committed to creating refreshing and enjoyable food and beverage products that bring great taste and value to everyday moments.
              </p>

              <p className="text-gray-600 leading-relaxed">
                We focus on quality, hygiene, attractive presentation and affordable pricing. Our range of products is designed to cater to families, children, and everyone who enjoys a refreshing treat.
              </p>

              <p className="text-gray-600 leading-relaxed">
                From our refreshing Water Based Tube Ice in multiple fruity flavours to our creamy Milk Tube Ice and convenient Juice Bottles, each product is crafted with care to ensure a delightful experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t">
              {[
                { title: 'Quality', desc: 'We maintain high standards in every product we make.', icon: '✨' },
                { title: 'Hygiene', desc: 'Our production facilities follow strict hygiene protocols.', icon: '🛡️' },
                { title: 'Affordability', desc: 'Premium taste at prices that fit every budget.', icon: '💰' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold font-heading text-brand-dark">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="bg-gradient-to-r from-brand-orange to-brand-red text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all inline-block"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
