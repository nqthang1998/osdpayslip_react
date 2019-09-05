using System.ComponentModel.DataAnnotations;

namespace OSDPayslip.Data.Infrastructure
{
    public class DomainEntity<T>
    {
        [Key]
        public T Id { get; set; }

        public bool IsTransient()
        {
            return Id.Equals(default(T));
        }
    }
}