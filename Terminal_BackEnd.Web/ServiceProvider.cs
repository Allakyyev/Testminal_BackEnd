namespace Terminal_BackEnd.Web {
    public static class ServiceProvider {
        public static IServiceCollection collection { get; set; }
        public static T? GetService<T>() {
            if(collection == null) return default(T);
            return collection.BuildServiceProvider().GetService<T>();
        }
    }
}
