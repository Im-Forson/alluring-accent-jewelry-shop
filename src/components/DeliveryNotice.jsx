export default function DeliveryNotice() {
    return (
        <section className="flex items-center justify-center py-8 md:py-10 mb-8 md:mb-12">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-full px-6 md:px-10 py-4 md:py-5 text-center">
                <p className="text-sm md:text-lg font-semibold text-gray-800">
                  <span className="text-pink-600 font-bold">Delivery Days:</span> <span className="text-gray-700">Tuesdays & Fridays</span>
                </p>
                
            </div>
        </section>
    );
}
